import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, TokenBlocklist
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__, static_folder=static_file_dir)
app.url_map.strict_slashes = False

# CORS para permitir peticiones del frontend
CORS(app, supports_credentials=True)

# JWT config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_APP_KEY", "super-secret-key")
jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None


# Database
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración adicional
setup_admin(app)
setup_commands(app)

# Registrar rutas de API
app.register_blueprint(api, url_prefix="/api")

# Sitemap (solo en desarrollo)


@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")

# Servir archivos estáticos del frontend


@app.route("/<path:path>", methods=["GET"])
def serve_react_app(path):
    file_path = os.path.join(static_file_dir, path)
    if os.path.exists(file_path):
        return send_from_directory(static_file_dir, path)
    return send_from_directory(static_file_dir, "index.html")

# Manejo de errores


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# Entrada principal
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
