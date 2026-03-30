# 💰 Gestor de Gastos - Aplicación de Finanzas Personales

Una aplicación moderna y completa para administrar tus gastos e ingresos personales, construida con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Dashboard Intuitivo**: Visualiza tu balance, ingresos y gastos totales de un vistazo
- **Gráficos Interactivos**: 
  - Gráfico de torta mostrando gastos por categoría
  - Gráfico de barras comparando ingresos vs gastos mensuales
- **Gestión de Transacciones**:
  - Añadir gastos e ingresos fácilmente
  - Categorización automática
  - Eliminar transacciones con un clic
- **Categorías Predefinidas**:
  - Gastos: Comida, Transporte, Compras, Entretenimiento, Servicios, Salud
  - Ingresos: Salario, Freelance, Inversiones
- **Persistencia en la Nube**: Datos almacenados en Supabase
- **Diseño Responsive**: Funciona perfectamente en móvil, tablet y escritorio
- **Notificaciones**: Feedback instantáneo de cada acción

## 📋 Pre-requisitos

- Node.js 18+ 
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

## 🛠️ Instalación

### 1. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el SQL Editor, ejecuta el siguiente script para crear la tabla:

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

-- Política para permitir todas las operaciones
CREATE POLICY "Allow all operations" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. Obtén tus credenciales:
   - Ve a Settings > API
   - Copia la `URL` del proyecto
   - Copia la `anon/public` key

### 2. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

2. Reemplaza los valores con tus credenciales de Supabase

### 3. Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 4. Iniciar la Aplicación

```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📱 Uso

### Añadir una Transacción

1. Haz clic en el botón "Nueva Transacción"
2. Selecciona el tipo (Gasto o Ingreso)
3. Completa el formulario:
   - Descripción (ej: "Supermercado Carrefour")
   - Cantidad en euros
   - Categoría
   - Fecha
4. Haz clic en "Añadir"

### Ver el Dashboard

El dashboard principal muestra:
- **Balance Total**: Diferencia entre ingresos y gastos
- **Ingresos Totales**: Suma de todos los ingresos
- **Gastos Totales**: Suma de todos los gastos
- **Gráficos**: Visualización de gastos por categoría e ingresos vs gastos
- **Transacciones Recientes**: Lista completa de todas las transacciones

### Eliminar una Transacción

Haz clic en el icono de papelera al lado de cualquier transacción en la lista.

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes de UI reutilizables
│   │   ├── Dashboard.tsx    # Vista principal
│   │   ├── AddTransaction.tsx
│   │   ├── TransactionList.tsx
│   │   ├── Charts.tsx
│   │   └── StatsCard.tsx
│   ├── lib/
│   │   ├── supabase.ts      # Cliente de Supabase
│   │   └── transactions.ts  # Funciones CRUD
│   ├── utils/
│   │   └── categories.ts    # Configuración de categorías
│   ├── types.ts             # TypeScript types
│   ├── routes.ts            # Configuración de rutas
│   └── App.tsx              # Componente principal
└── styles/                  # Estilos globales
```

## 🎨 Tecnologías Utilizadas

- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool
- **React Router**: Navegación
- **Tailwind CSS**: Estilos
- **Supabase**: Base de datos y backend
- **Recharts**: Gráficos y visualizaciones
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast

## 🔒 Seguridad

- Los datos se almacenan en Supabase con Row Level Security (RLS)
- Las credenciales se gestionan mediante variables de entorno
- Nunca expongas tu `service_role_key` en el frontend

## 📝 Notas

- Esta aplicación utiliza el `anon key` de Supabase, que es seguro para el frontend
- Para producción, considera implementar autenticación de usuarios
- Los datos de ejemplo se pueden eliminar una vez que empieces a usar la app

## 🤝 Contribuir

¿Encontraste un bug o tienes una idea? ¡Las contribuciones son bienvenidas!

## 📄 Licencia

MIT

---

Hecho con ❤️ para una mejor administración de tus finanzas personales
