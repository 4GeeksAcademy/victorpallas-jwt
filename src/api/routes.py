from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from flask_bcrypt import Bcrypt

# Crear el Blueprint para agrupar las rutas bajo /api
api = Blueprint('api', __name__)
bcrypt = Bcrypt()

# Ruta de prueba para verificar que el backend está funcionando


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {
        "message": "Hola desde el backend"
    }
    return jsonify(response_body), 200


# Registro de usuario
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    fullname = data.get("fullname")

    if not email or not password or not fullname:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password=hashed_password, fullname=fullname)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado con éxito"}), 201


# Login y generación del token
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "msg": "Login correcto",
        "token": token
    }), 200


# Ruta protegida que requiere JWT
@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        return jsonify({"msg": f"Hola, {user.fullname}"}), 200
    else:
        return jsonify({"msg": "Usuario no encontrado"}), 404
