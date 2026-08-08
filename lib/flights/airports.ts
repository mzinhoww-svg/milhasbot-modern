/**
 * Base de aeroportos das Américas atendidos pelas companhias em
 * lib/flights/airlines.ts. Coordenadas em graus decimais.
 *
 * O recorte é intencional: só entram aeroportos com voo regular de pelo menos
 * uma das companhias mapeadas. Isso mantém o grafo pequeno o bastante para
 * rodar inteiro no navegador.
 */

export type Regiao =
  | 'Brasil'
  | 'América do Sul'
  | 'América Central'
  | 'Caribe'
  | 'México'
  | 'América do Norte';

export interface Airport {
  iata: string;
  nome: string;
  cidade: string;
  pais: string;
  /** ISO 3166-1 alfa-2, usado para agrupar e para a bandeira. */
  cc: string;
  regiao: Regiao;
  lat: number;
  lon: number;
  /** Fuso IANA — usado para estimar o horário local de chegada. */
  tz: string;
}

export const airports: Airport[] = [
  // ---------------------------------------------------------------- Brasil
  { iata: 'GRU', nome: 'Guarulhos', cidade: 'São Paulo', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -23.4356, lon: -46.4731, tz: 'America/Sao_Paulo' },
  { iata: 'CGH', nome: 'Congonhas', cidade: 'São Paulo', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -23.6266, lon: -46.6554, tz: 'America/Sao_Paulo' },
  { iata: 'VCP', nome: 'Viracopos', cidade: 'Campinas', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -23.0074, lon: -47.1345, tz: 'America/Sao_Paulo' },
  { iata: 'GIG', nome: 'Galeão', cidade: 'Rio de Janeiro', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -22.81, lon: -43.2506, tz: 'America/Sao_Paulo' },
  { iata: 'SDU', nome: 'Santos Dumont', cidade: 'Rio de Janeiro', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -22.9105, lon: -43.1631, tz: 'America/Sao_Paulo' },
  { iata: 'BSB', nome: 'Presidente Juscelino Kubitschek', cidade: 'Brasília', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -15.8697, lon: -47.9208, tz: 'America/Sao_Paulo' },
  { iata: 'CNF', nome: 'Confins', cidade: 'Belo Horizonte', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -19.6336, lon: -43.9686, tz: 'America/Sao_Paulo' },
  { iata: 'POA', nome: 'Salgado Filho', cidade: 'Porto Alegre', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -29.9944, lon: -51.1714, tz: 'America/Sao_Paulo' },
  { iata: 'CWB', nome: 'Afonso Pena', cidade: 'Curitiba', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -25.5285, lon: -49.1758, tz: 'America/Sao_Paulo' },
  { iata: 'FLN', nome: 'Hercílio Luz', cidade: 'Florianópolis', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -27.6705, lon: -48.5477, tz: 'America/Sao_Paulo' },
  { iata: 'SSA', nome: 'Deputado Luís Eduardo Magalhães', cidade: 'Salvador', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -12.9086, lon: -38.3225, tz: 'America/Bahia' },
  { iata: 'REC', nome: 'Guararapes', cidade: 'Recife', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -8.1264, lon: -34.9236, tz: 'America/Recife' },
  { iata: 'FOR', nome: 'Pinto Martins', cidade: 'Fortaleza', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -3.7763, lon: -38.5326, tz: 'America/Fortaleza' },
  { iata: 'NAT', nome: 'Aluízio Alves', cidade: 'Natal', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -5.7681, lon: -35.3762, tz: 'America/Fortaleza' },
  { iata: 'MCZ', nome: 'Zumbi dos Palmares', cidade: 'Maceió', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -9.5108, lon: -35.7917, tz: 'America/Maceio' },
  { iata: 'JPA', nome: 'Castro Pinto', cidade: 'João Pessoa', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -7.1484, lon: -34.9506, tz: 'America/Fortaleza' },
  { iata: 'AJU', nome: 'Santa Maria', cidade: 'Aracaju', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -10.984, lon: -37.0703, tz: 'America/Maceio' },
  { iata: 'BEL', nome: 'Val de Cans', cidade: 'Belém', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -1.3792, lon: -48.4763, tz: 'America/Belem' },
  { iata: 'MAO', nome: 'Eduardo Gomes', cidade: 'Manaus', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -3.0386, lon: -60.0497, tz: 'America/Manaus' },
  { iata: 'SLZ', nome: 'Marechal Cunha Machado', cidade: 'São Luís', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -2.5853, lon: -44.2341, tz: 'America/Fortaleza' },
  { iata: 'THE', nome: 'Senador Petrônio Portella', cidade: 'Teresina', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -5.06, lon: -42.8235, tz: 'America/Fortaleza' },
  { iata: 'CGB', nome: 'Marechal Rondon', cidade: 'Cuiabá', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -15.6529, lon: -56.1167, tz: 'America/Cuiaba' },
  { iata: 'CGR', nome: 'Campo Grande', cidade: 'Campo Grande', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -20.4687, lon: -54.6725, tz: 'America/Campo_Grande' },
  { iata: 'GYN', nome: 'Santa Genoveva', cidade: 'Goiânia', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -16.632, lon: -49.2207, tz: 'America/Sao_Paulo' },
  { iata: 'VIX', nome: 'Eurico de Aguiar Salles', cidade: 'Vitória', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -20.2581, lon: -40.2864, tz: 'America/Sao_Paulo' },
  { iata: 'IGU', nome: 'Cataratas', cidade: 'Foz do Iguaçu', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -25.5946, lon: -54.4872, tz: 'America/Sao_Paulo' },
  { iata: 'BPS', nome: 'Porto Seguro', cidade: 'Porto Seguro', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -16.4386, lon: -39.0808, tz: 'America/Bahia' },
  { iata: 'NVT', nome: 'Ministro Victor Konder', cidade: 'Navegantes', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -26.88, lon: -48.6514, tz: 'America/Sao_Paulo' },
  { iata: 'JOI', nome: 'Lauro Carneiro de Loyola', cidade: 'Joinville', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -26.2245, lon: -48.7974, tz: 'America/Sao_Paulo' },
  { iata: 'LDB', nome: 'Governador José Richa', cidade: 'Londrina', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -23.3335, lon: -51.13, tz: 'America/Sao_Paulo' },
  { iata: 'MGF', nome: 'Sílvio Name Júnior', cidade: 'Maringá', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -23.4794, lon: -52.0136, tz: 'America/Sao_Paulo' },
  { iata: 'CXJ', nome: 'Hugo Cantergiani', cidade: 'Caxias do Sul', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -29.1971, lon: -51.1875, tz: 'America/Sao_Paulo' },
  { iata: 'RAO', nome: 'Leite Lopes', cidade: 'Ribeirão Preto', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -21.1364, lon: -47.7767, tz: 'America/Sao_Paulo' },
  { iata: 'UDI', nome: 'Ten. Cel. Av. César Bombonato', cidade: 'Uberlândia', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -18.8836, lon: -48.2256, tz: 'America/Sao_Paulo' },
  { iata: 'PMW', nome: 'Brigadeiro Lysias Rodrigues', cidade: 'Palmas', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -10.2915, lon: -48.357, tz: 'America/Araguaina' },
  { iata: 'PVH', nome: 'Governador Jorge Teixeira', cidade: 'Porto Velho', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -8.7093, lon: -63.9023, tz: 'America/Porto_Velho' },
  { iata: 'RBR', nome: 'Plácido de Castro', cidade: 'Rio Branco', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -9.869, lon: -67.894, tz: 'America/Rio_Branco' },
  { iata: 'BVB', nome: 'Atlas Brasil Cantanhede', cidade: 'Boa Vista', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: 2.8419, lon: -60.6922, tz: 'America/Boa_Vista' },
  { iata: 'MCP', nome: 'Alberto Alcolumbre', cidade: 'Macapá', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: 0.0507, lon: -51.0722, tz: 'America/Belem' },
  { iata: 'STM', nome: 'Maestro Wilson Fonseca', cidade: 'Santarém', pais: 'Brasil', cc: 'BR', regiao: 'Brasil', lat: -2.4247, lon: -54.7858, tz: 'America/Santarem' },

  // -------------------------------------------------------- América do Sul
  { iata: 'EZE', nome: 'Ezeiza', cidade: 'Buenos Aires', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -34.8222, lon: -58.5358, tz: 'America/Argentina/Buenos_Aires' },
  { iata: 'AEP', nome: 'Aeroparque Jorge Newbery', cidade: 'Buenos Aires', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -34.5592, lon: -58.4156, tz: 'America/Argentina/Buenos_Aires' },
  { iata: 'COR', nome: 'Ingeniero Taravella', cidade: 'Córdoba', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -31.3236, lon: -64.208, tz: 'America/Argentina/Cordoba' },
  { iata: 'MDZ', nome: 'El Plumerillo', cidade: 'Mendoza', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -32.8317, lon: -68.7929, tz: 'America/Argentina/Mendoza' },
  { iata: 'ROS', nome: 'Islas Malvinas', cidade: 'Rosário', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -32.9036, lon: -60.785, tz: 'America/Argentina/Buenos_Aires' },
  { iata: 'BRC', nome: 'San Carlos de Bariloche', cidade: 'Bariloche', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -41.1512, lon: -71.1575, tz: 'America/Argentina/Salta' },
  { iata: 'USH', nome: 'Malvinas Argentinas', cidade: 'Ushuaia', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -54.8433, lon: -68.2958, tz: 'America/Argentina/Ushuaia' },
  { iata: 'IGR', nome: 'Cataratas del Iguazú', cidade: 'Puerto Iguazú', pais: 'Argentina', cc: 'AR', regiao: 'América do Sul', lat: -25.7373, lon: -54.4734, tz: 'America/Argentina/Buenos_Aires' },
  { iata: 'SCL', nome: 'Arturo Merino Benítez', cidade: 'Santiago', pais: 'Chile', cc: 'CL', regiao: 'América do Sul', lat: -33.393, lon: -70.7858, tz: 'America/Santiago' },
  { iata: 'ANF', nome: 'Cerro Moreno', cidade: 'Antofagasta', pais: 'Chile', cc: 'CL', regiao: 'América do Sul', lat: -23.4445, lon: -70.4451, tz: 'America/Santiago' },
  { iata: 'CJC', nome: 'El Loa', cidade: 'Calama', pais: 'Chile', cc: 'CL', regiao: 'América do Sul', lat: -22.4989, lon: -68.9036, tz: 'America/Santiago' },
  { iata: 'PMC', nome: 'El Tepual', cidade: 'Puerto Montt', pais: 'Chile', cc: 'CL', regiao: 'América do Sul', lat: -41.4389, lon: -73.094, tz: 'America/Santiago' },
  { iata: 'IPC', nome: 'Mataveri', cidade: 'Ilha de Páscoa', pais: 'Chile', cc: 'CL', regiao: 'América do Sul', lat: -27.1648, lon: -109.4219, tz: 'Pacific/Easter' },
  { iata: 'LIM', nome: 'Jorge Chávez', cidade: 'Lima', pais: 'Peru', cc: 'PE', regiao: 'América do Sul', lat: -12.0219, lon: -77.1143, tz: 'America/Lima' },
  { iata: 'CUZ', nome: 'Alejandro Velasco Astete', cidade: 'Cusco', pais: 'Peru', cc: 'PE', regiao: 'América do Sul', lat: -13.5357, lon: -71.9388, tz: 'America/Lima' },
  { iata: 'AQP', nome: 'Rodríguez Ballón', cidade: 'Arequipa', pais: 'Peru', cc: 'PE', regiao: 'América do Sul', lat: -16.3411, lon: -71.583, tz: 'America/Lima' },
  { iata: 'UIO', nome: 'Mariscal Sucre', cidade: 'Quito', pais: 'Equador', cc: 'EC', regiao: 'América do Sul', lat: -0.1292, lon: -78.3575, tz: 'America/Guayaquil' },
  { iata: 'GYE', nome: 'José Joaquín de Olmedo', cidade: 'Guayaquil', pais: 'Equador', cc: 'EC', regiao: 'América do Sul', lat: -2.1574, lon: -79.8836, tz: 'America/Guayaquil' },
  { iata: 'GPS', nome: 'Seymour', cidade: 'Galápagos', pais: 'Equador', cc: 'EC', regiao: 'América do Sul', lat: -0.4536, lon: -90.2659, tz: 'Pacific/Galapagos' },
  { iata: 'BOG', nome: 'El Dorado', cidade: 'Bogotá', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 4.7016, lon: -74.1469, tz: 'America/Bogota' },
  { iata: 'MDE', nome: 'José María Córdova', cidade: 'Medellín', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 6.1645, lon: -75.4231, tz: 'America/Bogota' },
  { iata: 'CTG', nome: 'Rafael Núñez', cidade: 'Cartagena', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 10.4424, lon: -75.513, tz: 'America/Bogota' },
  { iata: 'CLO', nome: 'Alfonso Bonilla Aragón', cidade: 'Cali', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 3.5432, lon: -76.3816, tz: 'America/Bogota' },
  { iata: 'BAQ', nome: 'Ernesto Cortissoz', cidade: 'Barranquilla', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 10.8896, lon: -74.7808, tz: 'America/Bogota' },
  { iata: 'SMR', nome: 'Simón Bolívar', cidade: 'Santa Marta', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 11.1196, lon: -74.2306, tz: 'America/Bogota' },
  { iata: 'PEI', nome: 'Matecaña', cidade: 'Pereira', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 4.8127, lon: -75.7395, tz: 'America/Bogota' },
  { iata: 'ADZ', nome: 'Gustavo Rojas Pinilla', cidade: 'San Andrés', pais: 'Colômbia', cc: 'CO', regiao: 'América do Sul', lat: 12.5836, lon: -81.7112, tz: 'America/Bogota' },
  { iata: 'CCS', nome: 'Simón Bolívar', cidade: 'Caracas', pais: 'Venezuela', cc: 'VE', regiao: 'América do Sul', lat: 10.6013, lon: -66.9911, tz: 'America/Caracas' },
  { iata: 'ASU', nome: 'Silvio Pettirossi', cidade: 'Assunção', pais: 'Paraguai', cc: 'PY', regiao: 'América do Sul', lat: -25.24, lon: -57.52, tz: 'America/Asuncion' },
  { iata: 'MVD', nome: 'Carrasco', cidade: 'Montevidéu', pais: 'Uruguai', cc: 'UY', regiao: 'América do Sul', lat: -34.8384, lon: -56.0308, tz: 'America/Montevideo' },
  { iata: 'PDP', nome: 'Laguna del Sauce', cidade: 'Punta del Este', pais: 'Uruguai', cc: 'UY', regiao: 'América do Sul', lat: -34.8551, lon: -55.0943, tz: 'America/Montevideo' },
  { iata: 'VVI', nome: 'Viru Viru', cidade: 'Santa Cruz de la Sierra', pais: 'Bolívia', cc: 'BO', regiao: 'América do Sul', lat: -17.6448, lon: -63.1354, tz: 'America/La_Paz' },
  { iata: 'LPB', nome: 'El Alto', cidade: 'La Paz', pais: 'Bolívia', cc: 'BO', regiao: 'América do Sul', lat: -16.5133, lon: -68.1923, tz: 'America/La_Paz' },
  { iata: 'GEO', nome: 'Cheddi Jagan', cidade: 'Georgetown', pais: 'Guiana', cc: 'GY', regiao: 'América do Sul', lat: 6.4985, lon: -58.2541, tz: 'America/Guyana' },
  { iata: 'PBM', nome: 'Johan Adolf Pengel', cidade: 'Paramaribo', pais: 'Suriname', cc: 'SR', regiao: 'América do Sul', lat: 5.4528, lon: -55.1878, tz: 'America/Paramaribo' },

  // ------------------------------------------------------------- México
  { iata: 'MEX', nome: 'Benito Juárez', cidade: 'Cidade do México', pais: 'México', cc: 'MX', regiao: 'México', lat: 19.4363, lon: -99.0721, tz: 'America/Mexico_City' },
  { iata: 'NLU', nome: 'Felipe Ángeles', cidade: 'Cidade do México', pais: 'México', cc: 'MX', regiao: 'México', lat: 19.7561, lon: -99.0147, tz: 'America/Mexico_City' },
  { iata: 'CUN', nome: 'Cancún', cidade: 'Cancún', pais: 'México', cc: 'MX', regiao: 'México', lat: 21.0365, lon: -86.8771, tz: 'America/Cancun' },
  { iata: 'GDL', nome: 'Miguel Hidalgo y Costilla', cidade: 'Guadalajara', pais: 'México', cc: 'MX', regiao: 'México', lat: 20.5218, lon: -103.3111, tz: 'America/Mexico_City' },
  { iata: 'MTY', nome: 'Mariano Escobedo', cidade: 'Monterrey', pais: 'México', cc: 'MX', regiao: 'México', lat: 25.7785, lon: -100.1069, tz: 'America/Monterrey' },
  { iata: 'TIJ', nome: 'Abelardo L. Rodríguez', cidade: 'Tijuana', pais: 'México', cc: 'MX', regiao: 'México', lat: 32.5411, lon: -116.97, tz: 'America/Tijuana' },
  { iata: 'SJD', nome: 'Los Cabos', cidade: 'San José del Cabo', pais: 'México', cc: 'MX', regiao: 'México', lat: 23.1518, lon: -109.7211, tz: 'America/Mazatlan' },
  { iata: 'PVR', nome: 'Licenciado Gustavo Díaz Ordaz', cidade: 'Puerto Vallarta', pais: 'México', cc: 'MX', regiao: 'México', lat: 20.6801, lon: -105.2544, tz: 'America/Mexico_City' },
  { iata: 'MID', nome: 'Manuel Crescencio Rejón', cidade: 'Mérida', pais: 'México', cc: 'MX', regiao: 'México', lat: 20.937, lon: -89.6577, tz: 'America/Merida' },
  { iata: 'BJX', nome: 'Del Bajío', cidade: 'León/Guanajuato', pais: 'México', cc: 'MX', regiao: 'México', lat: 20.9935, lon: -101.4808, tz: 'America/Mexico_City' },
  { iata: 'QRO', nome: 'Querétaro', cidade: 'Querétaro', pais: 'México', cc: 'MX', regiao: 'México', lat: 20.6173, lon: -100.1857, tz: 'America/Mexico_City' },

  // ---------------------------------------------------- América Central
  { iata: 'PTY', nome: 'Tocumen', cidade: 'Cidade do Panamá', pais: 'Panamá', cc: 'PA', regiao: 'América Central', lat: 9.0714, lon: -79.3835, tz: 'America/Panama' },
  { iata: 'SJO', nome: 'Juan Santamaría', cidade: 'San José', pais: 'Costa Rica', cc: 'CR', regiao: 'América Central', lat: 9.9939, lon: -84.2088, tz: 'America/Costa_Rica' },
  { iata: 'LIR', nome: 'Daniel Oduber Quirós', cidade: 'Liberia', pais: 'Costa Rica', cc: 'CR', regiao: 'América Central', lat: 10.5933, lon: -85.5444, tz: 'America/Costa_Rica' },
  { iata: 'GUA', nome: 'La Aurora', cidade: 'Cidade da Guatemala', pais: 'Guatemala', cc: 'GT', regiao: 'América Central', lat: 14.5833, lon: -90.5275, tz: 'America/Guatemala' },
  { iata: 'SAL', nome: 'Óscar Arnulfo Romero', cidade: 'San Salvador', pais: 'El Salvador', cc: 'SV', regiao: 'América Central', lat: 13.4409, lon: -89.0557, tz: 'America/El_Salvador' },
  { iata: 'SAP', nome: 'Ramón Villeda Morales', cidade: 'San Pedro Sula', pais: 'Honduras', cc: 'HN', regiao: 'América Central', lat: 15.4526, lon: -87.9236, tz: 'America/Tegucigalpa' },
  { iata: 'TGU', nome: 'Toncontín', cidade: 'Tegucigalpa', pais: 'Honduras', cc: 'HN', regiao: 'América Central', lat: 14.0608, lon: -87.2172, tz: 'America/Tegucigalpa' },
  { iata: 'MGA', nome: 'Augusto C. Sandino', cidade: 'Manágua', pais: 'Nicarágua', cc: 'NI', regiao: 'América Central', lat: 12.1415, lon: -86.1682, tz: 'America/Managua' },
  { iata: 'BZE', nome: 'Philip S. W. Goldson', cidade: 'Cidade de Belize', pais: 'Belize', cc: 'BZ', regiao: 'América Central', lat: 17.5391, lon: -88.3082, tz: 'America/Belize' },

  // ------------------------------------------------------------- Caribe
  { iata: 'HAV', nome: 'José Martí', cidade: 'Havana', pais: 'Cuba', cc: 'CU', regiao: 'Caribe', lat: 22.9892, lon: -82.4091, tz: 'America/Havana' },
  { iata: 'PUJ', nome: 'Punta Cana', cidade: 'Punta Cana', pais: 'República Dominicana', cc: 'DO', regiao: 'Caribe', lat: 18.5674, lon: -68.3634, tz: 'America/Santo_Domingo' },
  { iata: 'SDQ', nome: 'Las Américas', cidade: 'Santo Domingo', pais: 'República Dominicana', cc: 'DO', regiao: 'Caribe', lat: 18.4297, lon: -69.6689, tz: 'America/Santo_Domingo' },
  { iata: 'STI', nome: 'Cibao', cidade: 'Santiago de los Caballeros', pais: 'República Dominicana', cc: 'DO', regiao: 'Caribe', lat: 19.4061, lon: -70.6046, tz: 'America/Santo_Domingo' },
  { iata: 'MBJ', nome: 'Sangster', cidade: 'Montego Bay', pais: 'Jamaica', cc: 'JM', regiao: 'Caribe', lat: 18.5037, lon: -77.9134, tz: 'America/Jamaica' },
  { iata: 'KIN', nome: 'Norman Manley', cidade: 'Kingston', pais: 'Jamaica', cc: 'JM', regiao: 'Caribe', lat: 17.9357, lon: -76.7875, tz: 'America/Jamaica' },
  { iata: 'NAS', nome: 'Lynden Pindling', cidade: 'Nassau', pais: 'Bahamas', cc: 'BS', regiao: 'Caribe', lat: 25.039, lon: -77.4662, tz: 'America/Nassau' },
  { iata: 'SJU', nome: 'Luis Muñoz Marín', cidade: 'San Juan', pais: 'Porto Rico', cc: 'PR', regiao: 'Caribe', lat: 18.4394, lon: -66.0018, tz: 'America/Puerto_Rico' },
  { iata: 'AUA', nome: 'Reina Beatrix', cidade: 'Oranjestad', pais: 'Aruba', cc: 'AW', regiao: 'Caribe', lat: 12.5014, lon: -70.0152, tz: 'America/Aruba' },
  { iata: 'CUR', nome: 'Hato', cidade: 'Willemstad', pais: 'Curaçao', cc: 'CW', regiao: 'Caribe', lat: 12.1889, lon: -68.9598, tz: 'America/Curacao' },
  { iata: 'SXM', nome: 'Princess Juliana', cidade: 'Sint Maarten', pais: 'Sint Maarten', cc: 'SX', regiao: 'Caribe', lat: 18.041, lon: -63.1089, tz: 'America/Lower_Princes' },
  { iata: 'BGI', nome: 'Grantley Adams', cidade: 'Bridgetown', pais: 'Barbados', cc: 'BB', regiao: 'Caribe', lat: 13.0746, lon: -59.4925, tz: 'America/Barbados' },
  { iata: 'POS', nome: 'Piarco', cidade: 'Porto de Espanha', pais: 'Trinidad e Tobago', cc: 'TT', regiao: 'Caribe', lat: 10.5954, lon: -61.3372, tz: 'America/Port_of_Spain' },
  { iata: 'ANU', nome: 'V. C. Bird', cidade: 'Saint John’s', pais: 'Antígua e Barbuda', cc: 'AG', regiao: 'Caribe', lat: 17.1367, lon: -61.7927, tz: 'America/Antigua' },
  { iata: 'UVF', nome: 'Hewanorra', cidade: 'Vieux Fort', pais: 'Santa Lúcia', cc: 'LC', regiao: 'Caribe', lat: 13.7332, lon: -60.9526, tz: 'America/St_Lucia' },
  { iata: 'GND', nome: 'Maurice Bishop', cidade: 'Saint George’s', pais: 'Granada', cc: 'GD', regiao: 'Caribe', lat: 12.0042, lon: -61.7862, tz: 'America/Grenada' },
  { iata: 'PAP', nome: 'Toussaint Louverture', cidade: 'Porto Príncipe', pais: 'Haiti', cc: 'HT', regiao: 'Caribe', lat: 18.58, lon: -72.2925, tz: 'America/Port-au-Prince' },
  { iata: 'STT', nome: 'Cyril E. King', cidade: 'Saint Thomas', pais: 'Ilhas Virgens Americanas', cc: 'VI', regiao: 'Caribe', lat: 18.3373, lon: -64.9734, tz: 'America/St_Thomas' },
  { iata: 'STX', nome: 'Henry E. Rohlsen', cidade: 'Saint Croix', pais: 'Ilhas Virgens Americanas', cc: 'VI', regiao: 'Caribe', lat: 17.7019, lon: -64.7986, tz: 'America/St_Thomas' },
  { iata: 'PLS', nome: 'Providenciales', cidade: 'Providenciales', pais: 'Turks e Caicos', cc: 'TC', regiao: 'Caribe', lat: 21.7736, lon: -72.2659, tz: 'America/Grand_Turk' },
  { iata: 'GCM', nome: 'Owen Roberts', cidade: 'George Town', pais: 'Ilhas Cayman', cc: 'KY', regiao: 'Caribe', lat: 19.2928, lon: -81.3577, tz: 'America/Cayman' },
  { iata: 'PTP', nome: 'Pôle Caraïbes', cidade: 'Pointe-à-Pitre', pais: 'Guadalupe', cc: 'GP', regiao: 'Caribe', lat: 16.2653, lon: -61.5318, tz: 'America/Guadeloupe' },
  { iata: 'FDF', nome: 'Aimé Césaire', cidade: 'Fort-de-France', pais: 'Martinica', cc: 'MQ', regiao: 'Caribe', lat: 14.591, lon: -61.0032, tz: 'America/Martinique' },

  // -------------------------------------------------- América do Norte
  { iata: 'ATL', nome: 'Hartsfield-Jackson', cidade: 'Atlanta', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 33.6407, lon: -84.4277, tz: 'America/New_York' },
  { iata: 'DFW', nome: 'Dallas/Fort Worth', cidade: 'Dallas', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 32.8998, lon: -97.0403, tz: 'America/Chicago' },
  { iata: 'DEN', nome: 'Denver', cidade: 'Denver', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.8561, lon: -104.6737, tz: 'America/Denver' },
  { iata: 'ORD', nome: "O'Hare", cidade: 'Chicago', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 41.9742, lon: -87.9073, tz: 'America/Chicago' },
  { iata: 'MDW', nome: 'Midway', cidade: 'Chicago', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 41.786, lon: -87.7524, tz: 'America/Chicago' },
  { iata: 'LAX', nome: 'Los Angeles', cidade: 'Los Angeles', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 33.9416, lon: -118.4085, tz: 'America/Los_Angeles' },
  { iata: 'JFK', nome: 'John F. Kennedy', cidade: 'Nova York', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 40.6413, lon: -73.7781, tz: 'America/New_York' },
  { iata: 'EWR', nome: 'Newark Liberty', cidade: 'Nova York', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 40.6895, lon: -74.1745, tz: 'America/New_York' },
  { iata: 'LGA', nome: 'LaGuardia', cidade: 'Nova York', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 40.7769, lon: -73.874, tz: 'America/New_York' },
  { iata: 'SFO', nome: 'San Francisco', cidade: 'San Francisco', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 37.6213, lon: -122.379, tz: 'America/Los_Angeles' },
  { iata: 'SJC', nome: 'Mineta San José', cidade: 'San José (CA)', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 37.3639, lon: -121.9289, tz: 'America/Los_Angeles' },
  { iata: 'OAK', nome: 'Oakland', cidade: 'Oakland', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 37.7126, lon: -122.2197, tz: 'America/Los_Angeles' },
  { iata: 'SEA', nome: 'Seattle-Tacoma', cidade: 'Seattle', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 47.4502, lon: -122.3088, tz: 'America/Los_Angeles' },
  { iata: 'PDX', nome: 'Portland', cidade: 'Portland', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 45.5898, lon: -122.5951, tz: 'America/Los_Angeles' },
  { iata: 'LAS', nome: 'Harry Reid', cidade: 'Las Vegas', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 36.084, lon: -115.1537, tz: 'America/Los_Angeles' },
  { iata: 'PHX', nome: 'Sky Harbor', cidade: 'Phoenix', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 33.4352, lon: -112.0101, tz: 'America/Phoenix' },
  { iata: 'SLC', nome: 'Salt Lake City', cidade: 'Salt Lake City', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 40.7899, lon: -111.9791, tz: 'America/Denver' },
  { iata: 'MIA', nome: 'Miami', cidade: 'Miami', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 25.7959, lon: -80.287, tz: 'America/New_York' },
  { iata: 'FLL', nome: 'Fort Lauderdale-Hollywood', cidade: 'Fort Lauderdale', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 26.0742, lon: -80.1506, tz: 'America/New_York' },
  { iata: 'MCO', nome: 'Orlando', cidade: 'Orlando', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 28.4312, lon: -81.3081, tz: 'America/New_York' },
  { iata: 'TPA', nome: 'Tampa', cidade: 'Tampa', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 27.9755, lon: -82.5332, tz: 'America/New_York' },
  { iata: 'PBI', nome: 'Palm Beach', cidade: 'West Palm Beach', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 26.6832, lon: -80.0956, tz: 'America/New_York' },
  { iata: 'RSW', nome: 'Southwest Florida', cidade: 'Fort Myers', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 26.5362, lon: -81.7552, tz: 'America/New_York' },
  { iata: 'JAX', nome: 'Jacksonville', cidade: 'Jacksonville', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 30.4941, lon: -81.6879, tz: 'America/New_York' },
  { iata: 'IAH', nome: 'George Bush', cidade: 'Houston', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 29.9902, lon: -95.3368, tz: 'America/Chicago' },
  { iata: 'HOU', nome: 'William P. Hobby', cidade: 'Houston', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 29.6454, lon: -95.2789, tz: 'America/Chicago' },
  { iata: 'AUS', nome: 'Austin-Bergstrom', cidade: 'Austin', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 30.1975, lon: -97.6664, tz: 'America/Chicago' },
  { iata: 'SAT', nome: 'San Antonio', cidade: 'San Antonio', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 29.5337, lon: -98.4698, tz: 'America/Chicago' },
  { iata: 'MSY', nome: 'Louis Armstrong', cidade: 'Nova Orleans', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 29.9934, lon: -90.2581, tz: 'America/Chicago' },
  { iata: 'CLT', nome: 'Charlotte Douglas', cidade: 'Charlotte', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 35.2144, lon: -80.9473, tz: 'America/New_York' },
  { iata: 'RDU', nome: 'Raleigh-Durham', cidade: 'Raleigh', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 35.8801, lon: -78.788, tz: 'America/New_York' },
  { iata: 'BOS', nome: 'Logan', cidade: 'Boston', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 42.3656, lon: -71.0096, tz: 'America/New_York' },
  { iata: 'PHL', nome: 'Philadelphia', cidade: 'Filadélfia', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.8744, lon: -75.2424, tz: 'America/New_York' },
  { iata: 'DCA', nome: 'Reagan National', cidade: 'Washington', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 38.8512, lon: -77.0402, tz: 'America/New_York' },
  { iata: 'IAD', nome: 'Dulles', cidade: 'Washington', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 38.9531, lon: -77.4565, tz: 'America/New_York' },
  { iata: 'BWI', nome: 'Baltimore/Washington', cidade: 'Baltimore', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.1774, lon: -76.6684, tz: 'America/New_York' },
  { iata: 'DTW', nome: 'Detroit Metro', cidade: 'Detroit', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 42.2162, lon: -83.3554, tz: 'America/New_York' },
  { iata: 'MSP', nome: 'Minneapolis-Saint Paul', cidade: 'Mineápolis', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 44.8848, lon: -93.2223, tz: 'America/Chicago' },
  { iata: 'STL', nome: 'Lambert', cidade: 'Saint Louis', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 38.7487, lon: -90.37, tz: 'America/Chicago' },
  { iata: 'MCI', nome: 'Kansas City', cidade: 'Kansas City', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.2976, lon: -94.7139, tz: 'America/Chicago' },
  { iata: 'CVG', nome: 'Cincinnati/Northern Kentucky', cidade: 'Cincinnati', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.0489, lon: -84.6678, tz: 'America/New_York' },
  { iata: 'IND', nome: 'Indianapolis', cidade: 'Indianápolis', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 39.7173, lon: -86.2944, tz: 'America/Indiana/Indianapolis' },
  { iata: 'CLE', nome: 'Hopkins', cidade: 'Cleveland', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 41.4117, lon: -81.8498, tz: 'America/New_York' },
  { iata: 'PIT', nome: 'Pittsburgh', cidade: 'Pittsburgh', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 40.4915, lon: -80.2329, tz: 'America/New_York' },
  { iata: 'BNA', nome: 'Nashville', cidade: 'Nashville', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 36.1263, lon: -86.6774, tz: 'America/Chicago' },
  { iata: 'SAN', nome: 'San Diego', cidade: 'San Diego', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 32.7338, lon: -117.1933, tz: 'America/Los_Angeles' },
  { iata: 'SMF', nome: 'Sacramento', cidade: 'Sacramento', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 38.6951, lon: -121.5908, tz: 'America/Los_Angeles' },
  { iata: 'HNL', nome: 'Daniel K. Inouye', cidade: 'Honolulu', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 21.3245, lon: -157.9251, tz: 'Pacific/Honolulu' },
  { iata: 'ANC', nome: 'Ted Stevens', cidade: 'Anchorage', pais: 'Estados Unidos', cc: 'US', regiao: 'América do Norte', lat: 61.1743, lon: -149.9962, tz: 'America/Anchorage' },
  { iata: 'YYZ', nome: 'Pearson', cidade: 'Toronto', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 43.6777, lon: -79.6248, tz: 'America/Toronto' },
  { iata: 'YUL', nome: 'Trudeau', cidade: 'Montreal', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 45.4657, lon: -73.7455, tz: 'America/Toronto' },
  { iata: 'YVR', nome: 'Vancouver', cidade: 'Vancouver', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 49.1967, lon: -123.1815, tz: 'America/Vancouver' },
  { iata: 'YYC', nome: 'Calgary', cidade: 'Calgary', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 51.1315, lon: -114.0106, tz: 'America/Edmonton' },
  { iata: 'YEG', nome: 'Edmonton', cidade: 'Edmonton', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 53.3097, lon: -113.5801, tz: 'America/Edmonton' },
  { iata: 'YOW', nome: 'Macdonald-Cartier', cidade: 'Ottawa', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 45.3225, lon: -75.6692, tz: 'America/Toronto' },
  { iata: 'YHZ', nome: 'Stanfield', cidade: 'Halifax', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 44.8808, lon: -63.5086, tz: 'America/Halifax' },
  { iata: 'YWG', nome: 'Richardson', cidade: 'Winnipeg', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 49.91, lon: -97.2399, tz: 'America/Winnipeg' },
  { iata: 'YQB', nome: 'Jean Lesage', cidade: 'Quebec', pais: 'Canadá', cc: 'CA', regiao: 'América do Norte', lat: 46.7911, lon: -71.3933, tz: 'America/Toronto' },
];

export const airportByIata: ReadonlyMap<string, Airport> = new Map(
  airports.map((a) => [a.iata, a]),
);

export function getAirport(iata: string): Airport | undefined {
  return airportByIata.get(iata.toUpperCase());
}

/** Rótulo curto e estável, usado em listas e no <title> das páginas. */
export function airportLabel(a: Airport): string {
  return `${a.cidade} (${a.iata})`;
}

export const REGIOES: Regiao[] = [
  'Brasil',
  'América do Sul',
  'América Central',
  'Caribe',
  'México',
  'América do Norte',
];
