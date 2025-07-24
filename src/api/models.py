from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    fullname: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=True, default=True)
    is_admin: Mapped[bool] = mapped_column(
        Boolean(), nullable=True, default=False) 

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullname": self.fullname,
            "isActive": self.is_active,
            "isAdmin": self.is_admin  # 👈 También lo exponemos si es necesario
        }


class TokenBlocklist(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)


class Favorite(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    # Relación con el usuario
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey("user.id"), nullable=False)

    # Identificadores del recurso de SWAPI
    uid: Mapped[str] = mapped_column(
        String(50), nullable=False)  # ej. "1", "14"
    name: Mapped[str] = mapped_column(
        String(120), nullable=False)  # ej. "Luke Skywalker"
    # ej. "people", "planets", "vehicles"
    type: Mapped[str] = mapped_column(String(50), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "name": self.name,
            "type": self.type,
            "user_id": self.user_id
        }


# Relación en User
User.favorites = db.relationship("Favorite", backref="user", lazy=True)
