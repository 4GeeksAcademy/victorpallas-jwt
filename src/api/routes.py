from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from flask_bcrypt import Bcrypt
from .models import db, Favorite, User
from .utils import admin_required

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

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "msg": "Login correcto",
        "token": token
    }), 200


@api.route('/userinfo', methods=['GET'])
@jwt_required()
def user_info():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"user": user.serialize()}), 200


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


# Blog Starwars
@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([fav.serialize() for fav in favorites]), 200


@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()

    uid = data.get("uid")
    name = data.get("name")
    type_ = data.get("type")

    if not all([uid, name, type_]):
        return jsonify({"msg": "Faltan datos obligatorios (uid, name, type)"}), 400

    # Validar duplicado
    existing = Favorite.query.filter_by(
        user_id=user_id, uid=uid, type=type_).first()
    if existing:
        return jsonify({"msg": "Ya está en favoritos"}), 400

    favorite = Favorite(uid=uid, name=name, type=type_, user_id=user_id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify(favorite.serialize()), 201


@api.route('/favorites/<type_>/<uid>', methods=['DELETE'])
@jwt_required()
def delete_favorite(type_, uid):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(
        user_id=user_id, uid=uid, type=type_).first()
    if not favorite:
        return jsonify({"msg": "Favorito no encontrado"}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"msg": "Favorito eliminado"}), 200


@api.route('/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify({"users": [u.serialize() for u in users]}), 200


@api.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    user.fullname = data.get("fullname", user.fullname)
    user.email = data.get("email", user.email)
    user.is_active = data.get("is_active", user.is_active)
    user.is_admin = data.get("is_admin", user.is_admin)

    db.session.commit()
    return jsonify({"msg": "Usuario actualizado", "user": user.serialize()}), 200



@api.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200
