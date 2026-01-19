#!/usr/bin/env python3
"""
Script to add sample/synthetic data to the database for testing
"""
import random
from datetime import date, datetime, timedelta
from app.database import SessionLocal
from app.models import Record
from app.crud import generate_record_id

# Sample data lists
ZONES = ["Delhi", "GGN", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"]
HEATERS = ["Kunal", "Luxmi", "Dovy", None]
CONTROLLERS = ["6-button", "3-button", "touch", None]
CARDS = ["3-button", "6-button", None]
BODIES = ["MS", "SS", None]
CAPACITY_KW = ["6", "9", "12", "15", None]
SOLD_BY = ["Rajesh Kumar", "Priya Sharma", "Amit Singh", "Neha Patel", "Vikram Mehta", "Sneha Desai", None]
LEAD_SOURCES = ["Website", "Referral", "Walk-in", "Advertisement", "Social Media", "Phone Call", None]
CLIENT_NAMES = [
    "Ravi Kumar", "Sunita Devi", "Anil Sharma", "Kavita Singh", "Mohammed Ali",
    "Pooja Gupta", "Suresh Reddy", "Meera Patel", "Rajesh Iyer", "Anjali Nair",
    "Vikram Joshi", "Divya Rao", "Kiran Desai", "Arjun Malhotra", "Neha Chopra",
    "Rohit Agarwal", "Shreya Jain", "Amit Verma", "Pallavi Shah", "Nikhil Doshi",
    "Anita Mehta", "Sandeep Kapoor", "Richa Bansal", "Karan Arora", "Jyoti Sharma",
    "Manish Jain", "Swati Khanna", "Vivek Sinha", "Ritu Bajaj", "Ajay Chawla",
    "Preeti Malhotra", "Sachin Kumar", "Deepa Reddy", "Tarun Agarwal", "Asha Nair"
]
PHONE_PREFIXES = ["91", "98", "99", "97", "96", "95"]

def generate_phone():
    """Generate a random phone number"""
    prefix = random.choice(PHONE_PREFIXES)
    number = ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return f"{prefix}{number}"

def generate_address(zone):
    """Generate a random address"""
    streets = ["Main Road", "MG Road", "Park Street", "Market Road", "Residency Road", "Station Road"]
    numbers = [str(random.randint(1, 999)) for _ in range(1)]
    street = random.choice(streets)
    return f"{random.choice(numbers)}, {street}, {zone}"

def get_db():
    """Get database session"""
    return SessionLocal()

def add_sample_data():
    """Add 35 sample records to the database, including multiple orders for same clients"""
    db = get_db()
    
    try:
        # Calculate date range (last 18 months for variety)
        today = date.today()
        start_date = today - timedelta(days=540)  # 18 months ago
        
        print("Adding sample data...")
        
        # Create some clients with multiple orders for history testing
        repeat_clients = [
            {
                "client_name": "Kiran Desai",
                "client_phone": "9876543210",
                "client_address": "123, MG Road, Delhi",
                "zone": "Delhi",
                "num_orders": 4  # This client will have 4 orders
            },
            {
                "client_name": "Priya Sharma",
                "client_phone": "9876543211",
                "client_address": "456, Park Street, Gurgaon",
                "zone": "Gurgaon",
                "num_orders": 3  # This client will have 3 orders
            },
            {
                "client_name": "Amit Singh",
                "client_phone": "9876543212",
                "client_address": "789, Main Road, Noida",
                "zone": "Noida",
                "num_orders": 2  # This client will have 2 orders
            },
            {
                "client_name": "Neha Patel",
                "client_phone": "9876543213",
                "client_address": "321, Market Road, GGN",
                "zone": "GGN",
                "num_orders": 2  # This client will have 2 orders
            }
        ]
        
        records_created = 0
        
        # Create multiple orders for repeat clients (same phone, same address)
        for client_data in repeat_clients:
            for order_num in range(client_data["num_orders"]):
                # Different dates for each order (spread over time, newest first)
                # Each order is spaced by ~90 days, starting from recent
                min_days = 30 + (order_num * 90)
                max_days = 540 - (order_num * 60)  # Ensure valid range
                if max_days <= min_days:
                    max_days = min_days + 30  # At least 30 days difference
                days_ago = random.randint(min_days, max_days)
                delivery_date = today - timedelta(days=days_ago)
                
                # Some records have installation (usually within 30 days of delivery)
                installation_date = None
                if random.random() > 0.3:  # 70% have installation
                    days_after = random.randint(0, 30)
                    installation_date = delivery_date + timedelta(days=days_after)
                
                # Some records have site visit (usually before delivery or installation)
                site_visit_date = None
                if random.random() > 0.4:  # 60% have site visit
                    days_before = random.randint(-60, 0)
                    site_visit_date = delivery_date + timedelta(days=days_before)
                
                # Generate record for repeat client
                record = Record(
                    record_id=generate_record_id(db),
                    date_of_delivery=delivery_date,
                    date_of_installation=installation_date,
                    date_of_site_visit=site_visit_date if site_visit_date else None,
                    site_visit_done_by=random.choice(["Tech Team A", "Tech Team B", "Field Engineer", "Site Supervisor"]) if site_visit_date else None,
                    installation_done_by=random.choice(["Installation Team 1", "Installation Team 2", "Contractor XYZ"]) if installation_date else None,
                    commission_done_by=random.choice(["Engineer John", "Engineer Sarah", "QA Team"]) if installation_date and random.random() > 0.5 else None,
                    capacity_kw=random.choice(CAPACITY_KW),
                    heater=random.choice(HEATERS),
                    controller=random.choice(CONTROLLERS),
                    card=random.choice(CARDS),
                    body=random.choice(BODIES),
                    client_name=client_data["client_name"],
                    client_phone=client_data["client_phone"],
                    client_address=client_data["client_address"],
                    zone=client_data["zone"],
                    sale_price=round(random.uniform(30000, 150000), 2) if random.random() > 0.1 else None,  # 90% have price
                    sold_by=random.choice(SOLD_BY),
                    lead_source=random.choice(LEAD_SOURCES),
                    remarks=f"Order #{order_num + 1} - {client_data['client_name']}" if order_num > 0 else random.choice([
                        "Installation completed successfully",
                        "Client satisfied with service",
                        "Follow-up required",
                        "Warranty documentation provided",
                        None,
                    ])
                )
                
                db.add(record)
                db.flush()
                records_created += 1
                
                if records_created % 10 == 0:
                    print(f"  Added {records_created} records...")
        
        # Create remaining unique records (different clients)
        remaining_records = 35 - records_created
        used_phones = {c["client_phone"] for c in repeat_clients}
        
        for i in range(remaining_records):
            # Random delivery date (within last 18 months)
            days_ago = random.randint(0, 540)
            delivery_date = today - timedelta(days=days_ago)
            
            # Some records have installation (usually within 30 days of delivery)
            installation_date = None
            if random.random() > 0.3:  # 70% have installation
                days_after = random.randint(0, 30)
                installation_date = delivery_date + timedelta(days=days_after)
            
            # Some records have site visit (usually before delivery or installation)
            site_visit_date = None
            if random.random() > 0.4:  # 60% have site visit
                days_before = random.randint(-60, 0)
                site_visit_date = delivery_date + timedelta(days=days_before)
            
            # Random client selection (unique phone)
            client_name = random.choice(CLIENT_NAMES)
            zone = random.choice(ZONES)
            
            # Generate unique phone number (not used by repeat clients)
            client_phone = generate_phone()
            while client_phone in used_phones:
                client_phone = generate_phone()
            used_phones.add(client_phone)
            
            # Generate record
            record = Record(
                record_id=generate_record_id(db),
                date_of_delivery=delivery_date,
                date_of_installation=installation_date,
                date_of_site_visit=site_visit_date if site_visit_date else None,
                site_visit_done_by=random.choice(["Tech Team A", "Tech Team B", "Field Engineer", "Site Supervisor"]) if site_visit_date else None,
                installation_done_by=random.choice(["Installation Team 1", "Installation Team 2", "Contractor XYZ"]) if installation_date else None,
                commission_done_by=random.choice(["Engineer John", "Engineer Sarah", "QA Team"]) if installation_date and random.random() > 0.5 else None,
                capacity_kw=random.choice(CAPACITY_KW),
                heater=random.choice(HEATERS),
                controller=random.choice(CONTROLLERS),
                card=random.choice(CARDS),
                body=random.choice(BODIES),
                client_name=client_name,
                client_phone=client_phone,
                client_address=generate_address(zone),
                zone=zone,
                sale_price=round(random.uniform(30000, 150000), 2) if random.random() > 0.1 else None,  # 90% have price
                sold_by=random.choice(SOLD_BY),
                lead_source=random.choice(LEAD_SOURCES),
                remarks=random.choice([
                    None,
                    "Installation completed successfully",
                    "Client satisfied with service",
                    "Follow-up required",
                    "Warranty documentation provided",
                    "Additional services requested",
                    "Regular maintenance scheduled",
                    None,
                    None,
                ])
            )
            
            db.add(record)
            db.flush()  # Flush to get the record ID generated and updated in the session
            records_created += 1
            
            if records_created % 10 == 0:
                print(f"  Added {records_created} records...")
        
        db.commit()
        print(f"✅ Successfully added {records_created} sample records!")
        print(f"   - Delivery dates range from {start_date} to {today}")
        print(f"   - Records distributed across zones: {', '.join(ZONES)}")
        print(f"   - Mix of installation dates and site visits")
        print(f"\n📋 Clients with multiple orders (for history testing):")
        for client in repeat_clients:
            print(f"   - {client['client_name']} ({client['client_phone']}): {client['num_orders']} orders")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error adding sample data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()
