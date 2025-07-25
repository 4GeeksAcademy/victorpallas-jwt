"""empty message

Revision ID: 10452320d270
Revises: cb80f985cd03
Create Date: 2025-07-24 15:44:19.125993

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '10452320d270'
down_revision = 'cb80f985cd03'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('usuario')
    with op.batch_alter_table('misfavoritos', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('misfavoritos_usuario_id_fkey'), type_='foreignkey')
        batch_op.create_foreign_key(None, 'user', ['usuario_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('misfavoritos', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('misfavoritos_usuario_id_fkey'), 'usuario', ['usuario_id'], ['id'])

    op.create_table('usuario',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False),
    sa.Column('fullname', sa.VARCHAR(length=120), autoincrement=False, nullable=True),
    sa.Column('password', sa.VARCHAR(length=120), autoincrement=False, nullable=False),
    sa.Column('is_admin', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('usuario_pkey')),
    sa.UniqueConstraint('email', name=op.f('usuario_email_key'), postgresql_include=[], postgresql_nulls_not_distinct=False)
    )
    # ### end Alembic commands ###
