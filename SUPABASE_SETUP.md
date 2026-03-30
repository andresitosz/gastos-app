# Instrucciones para configurar Supabase

## 1. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto copiando `.env.example`:

```bash
cp .env.example .env
```

Luego reemplaza las credenciales con las de tu proyecto Supabase.

## 2. Crear la tabla en Supabase

Ve a tu dashboard de Supabase y ejecuta este SQL:

```sql
-- Crear tabla de transacciones
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at BIGINT NOT NULL,
  created_at_timestamp TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Habilitar Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (ajusta según tus necesidades)
CREATE POLICY "Allow all operations" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Estructura de la tabla

La tabla `transactions` tiene los siguientes campos:

- `id` (UUID): Identificador único (generado automáticamente)
- `description` (TEXT): Descripción de la transacción
- `amount` (DECIMAL): Cantidad en euros
- `type` (TEXT): Tipo de transacción ('income' o 'expense')
- `category` (TEXT): Categoría ('food', 'transport', 'shopping', etc.)
- `date` (DATE): Fecha de la transacción
- `created_at` (BIGINT): Timestamp de creación en milisegundos
- `created_at_timestamp` (TIMESTAMP): Timestamp automático de creación

## 4. Categorías disponibles

### Gastos:
- food (Comida)
- transport (Transporte)
- shopping (Compras)
- entertainment (Entretenimiento)
- bills (Servicios)
- health (Salud)
- other (Otros)

### Ingresos:
- salary (Salario)
- freelance (Freelance)
- investment (Inversiones)
- other (Otros)

## 5. Seguridad

Las políticas de RLS (Row Level Security) están configuradas para permitir todas las operaciones. Si necesitas autenticación de usuarios, modifica las políticas según tus necesidades:

```sql
-- Ejemplo: Solo el propietario puede ver sus transacciones
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Recuerda agregar el campo user_id a la tabla si usas autenticación
```

## 6. Datos de ejemplo (opcional)

Si quieres empezar con datos de prueba:

```sql
INSERT INTO transactions (description, amount, type, category, date, created_at) VALUES
  ('Supermercado mensual', 250.50, 'expense', 'food', '2026-03-25', 1743033600000),
  ('Salario de marzo', 2800.00, 'income', 'salary', '2026-03-01', 1740960000000),
  ('Gasolina', 60.00, 'expense', 'transport', '2026-03-20', 1742601600000),
  ('Netflix', 13.99, 'expense', 'entertainment', '2026-03-15', 1742169600000),
  ('Proyecto freelance', 500.00, 'income', 'freelance', '2026-03-10', 1741737600000);
```
