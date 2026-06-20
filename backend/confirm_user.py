import sys
from dotenv import load_dotenv
load_dotenv()

from app.models.db import supabase

def main():
    if len(sys.argv) < 2:
        print("❌ Please provide an email address.")
        print("Usage: python confirm_user.py <email_address>")
        sys.exit(1)
        
    email = sys.argv[1]
    print(f"🔍 Searching for user with email: {email}...")
    
    try:
        # List users in Supabase Auth Admin
        # gotrue python client list_users() returns a list/dict or User response
        response = supabase.auth.admin.list_users()
        users = []
        if hasattr(response, "users"):
            users = response.users
        elif isinstance(response, list):
            users = response
        elif isinstance(response, dict) and "users" in response:
            users = response["users"]
            
        target_user = None
        for u in users:
            u_email = getattr(u, "email", None) or (u.get("email") if isinstance(u, dict) else None)
            if u_email == email:
                target_user = u
                break
                
        if not target_user:
            print(f"❌ User with email \"{email}\" was not found in your Supabase project.")
            return
            
        target_id = getattr(target_user, "id", None) or (target_user.get("id") if isinstance(target_user, dict) else None)
        print(f"Found user: {email} (ID: {target_id})")
        print("⚡ Confirming user email...")
        
        # In Python gotrue: admin.update_user_by_id(uid, attrs) or similar
        # e.g., supabase.auth.admin.update_user_by_id(target_id, {"email_confirm": True}) or AdminUserUpdate(email_confirm=True)
        # We can pass dictionary or import AdminUserUpdate from gotrue
        from gotrue.types import AdminUserUpdate
        update_attrs = AdminUserUpdate(email_confirm=True)
        supabase.auth.admin.update_user_by_id(target_id, update_attrs)
        
        print(f"\n✅ Success! User \"{email}\" has been manually confirmed.")
        print("You can now log in using this account on http://localhost:8080/login.")
        
    except Exception as e:
        # Fallback to direct dict call if AdminUserUpdate fails or is structured differently
        try:
            supabase.auth.admin.update_user_by_id(target_id, {"email_confirm": True})
            print(f"\n✅ Success! User \"{email}\" has been manually confirmed.")
        except Exception as inner_e:
            print(f"❌ Failed to confirm user: {e} (Inner: {inner_e})")

if __name__ == "__main__":
    main()
