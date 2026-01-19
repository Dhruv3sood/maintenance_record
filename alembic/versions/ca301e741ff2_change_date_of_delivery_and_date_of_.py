"""Change date_of_delivery and date_of_installation to date only

Revision ID: ca301e741ff2
Revises: 
Create Date: 2024-01-15 13:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'ca301e741ff2'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLite doesn't support ALTER COLUMN for type changes
    # We need to create a new table, copy data, drop old table, and rename
    conn = op.get_bind()
    
    # Check if SQLite
    if conn.dialect.name == 'sqlite':
        # Create new table with correct column types
        op.create_table(
            'records_new',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('record_id', sa.String(length=50), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.Column('date_of_delivery', sa.Date(), nullable=False),
            sa.Column('date_of_installation', sa.Date(), nullable=True),
            sa.Column('date_of_site_visit', sa.DateTime(), nullable=True),
            sa.Column('site_visit_done_by', sa.String(length=200), nullable=True),
            sa.Column('installation_done_by', sa.String(length=200), nullable=True),
            sa.Column('commission_done_by', sa.String(length=200), nullable=True),
            sa.Column('capacity_kw', sa.String(length=10), nullable=True),
            sa.Column('heater', sa.String(length=50), nullable=True),
            sa.Column('controller', sa.String(length=50), nullable=True),
            sa.Column('card', sa.String(length=50), nullable=True),
            sa.Column('body', sa.String(length=50), nullable=True),
            sa.Column('client_name', sa.String(length=200), nullable=False),
            sa.Column('client_phone', sa.String(length=20), nullable=True),
            sa.Column('client_address', sa.Text(), nullable=True),
            sa.Column('zone', sa.String(length=100), nullable=True),
            sa.Column('sale_price', sa.Numeric(precision=10, scale=2), nullable=True),
            sa.Column('sold_by', sa.String(length=200), nullable=True),
            sa.Column('lead_source', sa.String(length=200), nullable=True),
            sa.Column('remarks', sa.Text(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('record_id')
        )
        
        # Copy data from old table to new table, converting datetime to date
        conn.execute(text("""
            INSERT INTO records_new (
                id, record_id, created_at, updated_at,
                date_of_delivery, date_of_installation, date_of_site_visit,
                site_visit_done_by, installation_done_by, commission_done_by,
                capacity_kw, heater, controller, card, body,
                client_name, client_phone, client_address, zone,
                sale_price, sold_by, lead_source, remarks
            )
            SELECT 
                id, record_id, created_at, updated_at,
                DATE(date_of_delivery), 
                CASE WHEN date_of_installation IS NOT NULL THEN DATE(date_of_installation) ELSE NULL END,
                date_of_site_visit,
                site_visit_done_by, installation_done_by, commission_done_by,
                capacity_kw, heater, controller, card, body,
                client_name, client_phone, client_address, zone,
                sale_price, sold_by, lead_source, remarks
            FROM records
        """))
        
        # Drop old table
        op.drop_table('records')
        
        # Rename new table
        op.rename_table('records_new', 'records')
        
        # Recreate indexes
        op.create_index('idx_client_phone', 'records', ['client_phone'])
        op.create_index('idx_zone', 'records', ['zone'])
        op.create_index('idx_date_of_delivery', 'records', ['date_of_delivery'])
        op.create_index('idx_sold_by', 'records', ['sold_by'])
        op.create_index('idx_lead_source', 'records', ['lead_source'])
        op.create_index('idx_capacity_kw', 'records', ['capacity_kw'])
        op.create_index('idx_heater', 'records', ['heater'])
        op.create_index('idx_controller', 'records', ['controller'])
        op.create_index('idx_card', 'records', ['card'])
        op.create_index('idx_body', 'records', ['body'])
        op.create_index(op.f('ix_records_id'), 'records', ['id'], unique=False)
        op.create_index(op.f('ix_records_record_id'), 'records', ['record_id'], unique=False)
    else:
        # For PostgreSQL and other databases that support ALTER COLUMN
        op.alter_column('records', 'date_of_delivery',
                       existing_type=sa.DATETIME(),
                       type_=sa.Date(),
                       existing_nullable=False)
        op.alter_column('records', 'date_of_installation',
                       existing_type=sa.DATETIME(),
                       type_=sa.Date(),
                       existing_nullable=True)


def downgrade() -> None:
    # Reverse the process for downgrade
    conn = op.get_bind()
    
    if conn.dialect.name == 'sqlite':
        # Create old table with datetime types
        op.create_table(
            'records_old',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('record_id', sa.String(length=50), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.Column('date_of_delivery', sa.DateTime(), nullable=False),
            sa.Column('date_of_installation', sa.DateTime(), nullable=True),
            sa.Column('date_of_site_visit', sa.DateTime(), nullable=True),
            sa.Column('site_visit_done_by', sa.String(length=200), nullable=True),
            sa.Column('installation_done_by', sa.String(length=200), nullable=True),
            sa.Column('commission_done_by', sa.String(length=200), nullable=True),
            sa.Column('capacity_kw', sa.String(length=10), nullable=True),
            sa.Column('heater', sa.String(length=50), nullable=True),
            sa.Column('controller', sa.String(length=50), nullable=True),
            sa.Column('card', sa.String(length=50), nullable=True),
            sa.Column('body', sa.String(length=50), nullable=True),
            sa.Column('client_name', sa.String(length=200), nullable=False),
            sa.Column('client_phone', sa.String(length=20), nullable=True),
            sa.Column('client_address', sa.Text(), nullable=True),
            sa.Column('zone', sa.String(length=100), nullable=True),
            sa.Column('sale_price', sa.Numeric(precision=10, scale=2), nullable=True),
            sa.Column('sold_by', sa.String(length=200), nullable=True),
            sa.Column('lead_source', sa.String(length=200), nullable=True),
            sa.Column('remarks', sa.Text(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('record_id')
        )
        
        # Copy data back, converting date to datetime
        conn.execute(text("""
            INSERT INTO records_old (
                id, record_id, created_at, updated_at,
                date_of_delivery, date_of_installation, date_of_site_visit,
                site_visit_done_by, installation_done_by, commission_done_by,
                capacity_kw, heater, controller, card, body,
                client_name, client_phone, client_address, zone,
                sale_price, sold_by, lead_source, remarks
            )
            SELECT 
                id, record_id, created_at, updated_at,
                datetime(date_of_delivery || ' 00:00:00'),
                CASE WHEN date_of_installation IS NOT NULL THEN datetime(date_of_installation || ' 00:00:00') ELSE NULL END,
                date_of_site_visit,
                site_visit_done_by, installation_done_by, commission_done_by,
                capacity_kw, heater, controller, card, body,
                client_name, client_phone, client_address, zone,
                sale_price, sold_by, lead_source, remarks
            FROM records
        """))
        
        op.drop_table('records')
        op.rename_table('records_old', 'records')
        
        # Recreate indexes
        op.create_index('idx_client_phone', 'records', ['client_phone'])
        op.create_index('idx_zone', 'records', ['zone'])
        op.create_index('idx_date_of_delivery', 'records', ['date_of_delivery'])
        op.create_index('idx_sold_by', 'records', ['sold_by'])
        op.create_index('idx_lead_source', 'records', ['lead_source'])
        op.create_index('idx_capacity_kw', 'records', ['capacity_kw'])
        op.create_index('idx_heater', 'records', ['heater'])
        op.create_index('idx_controller', 'records', ['controller'])
        op.create_index('idx_card', 'records', ['card'])
        op.create_index('idx_body', 'records', ['body'])
        op.create_index(op.f('ix_records_id'), 'records', ['id'], unique=False)
        op.create_index(op.f('ix_records_record_id'), 'records', ['record_id'], unique=False)
    else:
        # For PostgreSQL
        op.alter_column('records', 'date_of_delivery',
                       existing_type=sa.Date(),
                       type_=sa.DATETIME(),
                       existing_nullable=False)
        op.alter_column('records', 'date_of_installation',
                       existing_type=sa.Date(),
                       type_=sa.DATETIME(),
                       existing_nullable=True)
