// app/api/gastos/cerrar-mes/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  
  const { mes, año } = await request.json()
  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()
  
  // Obtener todos los gastos del mes
  const { data: gastos } = await supabase
    .from('gastos')
    .select('*')
    .eq('user_id', user.id)
    .gte('fecha', `${año}-${mes}-01`)
    .lt('fecha', mes === 12 ? `${año+1}-01-01` : `${año}-${mes+1}-01`)
  
  const total = gastos?.reduce((sum, g) => sum + g.monto, 0) || 0
  
  // Guardar en tabla de histórico
  const { data, error } = await supabase
    .from('gastos_mensuales')
    .upsert({
      user_id: user.id,
      mes,
      año,
      total_gastos: total,
      gastos_detalle: gastos,
      updated_at: new Date()
    })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Limpiar gastos del mes actual (si quieres resetear)
  if (mes === mesActual && año === añoActual) {
    await supabase
      .from('gastos')
      .delete()
      .eq('user_id', user.id)
      .gte('fecha', `${año}-${mes}-01`)
  }
  
  return NextResponse.json({ success: true, total })
}