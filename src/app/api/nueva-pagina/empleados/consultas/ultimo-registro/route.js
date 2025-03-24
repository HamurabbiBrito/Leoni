// En /api/nueva-pagina/empleados/consultas/ultimo-registro
import { executeQuery } from '../../../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const numero = searchParams.get('numero');

    const query = `
      SELECT registro FROM "RegEmp"
      WHERE numero = $1
      ORDER BY fecha DESC
      LIMIT 1;
    `;

    const result = await executeQuery(query, [numero]);
    
    return new Response(JSON.stringify({
      registro: result[0]?.registro || null
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Error al consultar último registro"
    }), { status: 500 });
  }
}