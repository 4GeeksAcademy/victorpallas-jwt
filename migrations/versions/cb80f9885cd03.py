"""empty message

Revision ID: cb80f985cd03
Revises: 0763d677d453
Create Date: 2025-07-21 14:59:28.033353

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb80f985cd03'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('token_blocklist',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('jti', sa.String(length=50), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('fullname', sa.String(length=200), nullable=False))
        batch_op.alter_column('is_active',
                              existing_type=sa.BOOLEAN(),
                              nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('is_active',
                              existing_type=sa.BOOLEAN(),
                              nullable=False)
        batch_op.drop_column('fullname')

    op.drop_table('token_blocklist')
    # ### end Alembic commands ###
    
