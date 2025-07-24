from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from .models import db, User, Personas, Planeta, Misfavoritos, TokenBlocklist
from .utils import admin_required

api = Blueprint('api', __name__)
bcrypt = Bcrypt()

# --- Prueba de conexión ---


@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "Hola desde el backend"}), 200

# --- Registro y autenticación ---


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


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"msg": "Login correcto", "token": token}), 200


@api.route('/userinfo', methods=['GET'])
@jwt_required()
def userinfo():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"user": user.serialize()}), 200

# --- CRUD Personas ---


@api.route('/personas', methods=['GET'])
def listar_personas():
    personas = Personas.query.all()
    return jsonify([p.serialize() for p in personas]), 200


@api.route('/personas/<int:persona_id>', methods=['GET'])
def obtener_persona(persona_id):
    persona = Personas.query.get(persona_id)
    if not persona:
        return jsonify({"msg": "Persona no encontrada"}), 404
    return jsonify(persona.serialize()), 200


@api.route('/personas', methods=['POST'])
@jwt_required()
def crear_persona():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "Falta el nombre"}), 400
    nueva = Personas(name=name)
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.serialize()), 201


@api.route('/personas/<int:persona_id>', methods=['PUT'])
@jwt_required()
def editar_persona(persona_id):
    persona = Personas.query.get(persona_id)
    if not persona:
        return jsonify({"msg": "Persona no encontrada"}), 404
    data = request.get_json()
    persona.name = data.get("name", persona.name)
    db.session.commit()
    return jsonify({"msg": "Persona actualizada", "persona": persona.serialize()}), 200


@api.route('/personas/<int:persona_id>', methods=['DELETE'])
@jwt_required()
def eliminar_persona(persona_id):
    persona = Personas.query.get(persona_id)
    if not persona:
        return jsonify({"msg": "Persona no encontrada"}), 404
    db.session.delete(persona)
    db.session.commit()
    return jsonify({"msg": "Persona eliminada"}), 200

# --- CRUD Planetas ---


@api.route('/planetas', methods=['GET'])
def listar_planetas():
    planetas = Planeta.query.all()
    return jsonify([p.serialize() for p in planetas]), 200


@api.route('/planetas/<int:planeta_id>', methods=['GET'])
def obtener_planeta(planeta_id):
    planeta = Planeta.query.get(planeta_id)
    if not planeta:
        return jsonify({"msg": "Planeta no encontrado"}), 404
    return jsonify(planeta.serialize()), 200


@api.route('/planetas', methods=['POST'])
@jwt_required()
def crear_planeta():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "Falta el nombre"}), 400
    nuevo = Planeta(name=name)
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.serialize()), 201


@api.route('/planetas/<int:planeta_id>', methods=['PUT'])
@jwt_required()
def editar_planeta(planeta_id):
    planeta = Planeta.query.get(planeta_id)
    if not planeta:
        return jsonify({"msg": "Planeta no encontrado"}), 404
    data = request.get_json()
    planeta.name = data.get("name", planeta.name)
    db.session.commit()
    return jsonify({"msg": "Planeta actualizado", "planeta": planeta.serialize()}), 200


@api.route('/planetas/<int:planeta_id>', methods=['DELETE'])
@jwt_required()
def eliminar_planeta(planeta_id):
    planeta = Planeta.query.get(planeta_id)
    if not planeta:
        return jsonify({"msg": "Planeta no encontrado"}), 404
    db.session.delete(planeta)
    db.session.commit()
    return jsonify({"msg": "Planeta eliminado"}), 200

# --- CRUD Favoritos (misfavoritos y compatibilidad con /favorites) ---


def guardar_favorito(data, user_id):
    uid = data.get("uid")
    type = data.get("type")
    name = data.get("name")

    if not uid or not type or not name:
        return None, jsonify({"msg": "Faltan datos"}), 400

    existente = Misfavoritos.query.filter_by(
        uid=uid, type=type, usuario_id=user_id).first()
    if existente:
        return None, jsonify({"msg": "Ya está en favoritos"}), 409

    nuevo = Misfavoritos(uid=uid, type=type, name=name, usuario_id=user_id)
    db.session.add(nuevo)
    db.session.commit()
    return nuevo, None, 201


@api.route('/misfavoritos', methods=['GET'])
@api.route('/favorites', methods=['GET'])  # alias
@jwt_required()
def get_favoritos():
    user_id = get_jwt_identity()
    favoritos = Misfavoritos.query.filter_by(usuario_id=user_id).all()
    return jsonify([f.serialize() for f in favoritos]), 200


@api.route('/misfavoritos', methods=['POST'])
@api.route('/favorites', methods=['POST'])  # alias
@jwt_required()
def add_favorito():
    data = request.get_json()
    user_id = get_jwt_identity()
    favorito, error_response, status = guardar_favorito(data, user_id)
    if error_response:
        return error_response, status
    return jsonify(favorito.serialize()), status


@api.route('/misfavoritos/<string:type>/<string:uid>', methods=['DELETE'])
# alias
@api.route('/favorites/<string:type>/<string:uid>', methods=['DELETE'])
@jwt_required()
def delete_favorito(type, uid):
    user_id = get_jwt_identity()
    favorito = Misfavoritos.query.filter_by(
        uid=uid, type=type, usuario_id=user_id).first()
    if not favorito:
        return jsonify({"msg": "Favorito no encontrado"}), 404
    db.session.delete(favorito)
    db.session.commit()
    return jsonify({"msg": "Favorito eliminado"}), 200
    