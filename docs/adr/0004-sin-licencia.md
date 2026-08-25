# ADR 0004 — Repositorio sin licencia open source
 
**Estado:** Aceptado
 
## Contexto
 
RestroGest comenzó como un proyecto de práctica personal, pero existe la posibilidad de convertirlo, total o parcialmente, en un producto con intención comercial en el futuro. Era necesario decidir si el repositorio se publica bajo una licencia open source (ej. MIT) o sin licencia explícita.
 
## Decisión
 
El repositorio no incluye un archivo `LICENSE`. Por defecto, bajo ley de derechos de autor, esto significa que todos los derechos quedan reservados para la autora — nadie tiene permiso legal de usar, copiar, modificar o comercializar el código sin autorización explícita.
 
## Alternativas consideradas
 
**Licencia MIT (u otra permisiva).**
 
Se descartó por ahora porque otorgaría a cualquier tercero el permiso de usar, modificar y comercializar el código libremente (con solo dar crédito), lo cual entra en conflicto directo con la posibilidad, aún no descartada, de monetizar este proyecto en el futuro. Adoptar MIT ahora y querer revertirlo después no es sencillo: cualquier copia ya distribuida bajo esa licencia conserva esos permisos de forma irrevocable.
 
## Consecuencias
 
**Positivas:**
- Se preserva la opción de monetizar el proyecto en el futuro sin conflicto legal con permisos ya otorgados a terceros.
- La decisión es reversible en la dirección de abrir el código (agregar una licencia permisiva más adelante es sencillo), pero no en la dirección contraria.

**Negativas / trade-offs asumidos:**
- Un repositorio sin licencia puede percibirse como menos "abierto" o menos orientado a portafolio colaborativo por parte de reclutadores o colaboradores externos, que suelen esperar ver una licencia explícita en un repo público.
- Terceros no pueden legalmente clonar el proyecto con fines de estudio más allá de la lectura del código en el repositorio público, aunque en la práctica esto rara vez se hace cumplir para proyectos de portafolio.
## Notas
 
Esta decisión puede revisarse en un ADR posterior si la intención del proyecto se aclara definitivamente hacia un lado (apertura total como portafolio vs. producto comercial cerrado).
 