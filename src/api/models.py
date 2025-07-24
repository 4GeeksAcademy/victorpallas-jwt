from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    fullname: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=True, default=True)
    is_admin: Mapped[bool] = mapped_column(
        Boolean(), nullable=True, default=False)

    favorites = db.relationship("Favorite", backref="user", lazy=True)
    misfavoritos = db.relationship(
        "Misfavoritos", backref="usuario", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullname": self.fullname,
            "is_active": self.is_active,
            "is_admin": self.is_admin
        }


class TokenBlocklist(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)


class Favorite(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("user.id"), nullable=False)
    uid: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "name": self.name,
            "type": self.type,
            "user_id": self.user_id
        }


class Personas(db.Model):
    __tablename__ = 'personas'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Planeta(db.Model):
    __tablename__ = 'planeta'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Misfavoritos(db.Model):
    __tablename__ = 'misfavoritos'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    personas_id = db.Column(
        db.Integer, db.ForeignKey('personas.id'), nullable=True)
    planeta_id = db.Column(
        db.Integer, db.ForeignKey('planeta.id'), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "personas_id": self.personas_id,
            "planeta_id": self.planeta_id
        }
