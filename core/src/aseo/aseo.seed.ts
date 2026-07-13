import { DataSource } from 'typeorm';
import { Inmueble, TipoUso } from './entities/inmueble.entity';

export async function seedInmuebles(dataSource: DataSource) {
  const repo = dataSource.getRepository(Inmueble);
  const count = await repo.count();
  if (count > 0) return;

  const inmueblesSemilla = [
    {
      propietario_nombre: 'Juan Pérez',
      propietario_cedula: '001-0000001-1',
      direccion: 'Calle El Recodo 12',
      zona: 'Piantini',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'María López',
      propietario_cedula: '001-0000002-2',
      direccion: 'Av. Abraham Lincoln 45',
      zona: 'Piantini',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Carlos Gómez',
      propietario_cedula: '001-0000003-3',
      direccion: 'Calle Hostos 8',
      zona: 'Gazcue',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Ana Sánchez',
      propietario_cedula: '001-0000004-4',
      direccion: 'Calle El Conde 33',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Pedro Martínez',
      propietario_cedula: '001-0000005-5',
      direccion: 'Calle Seminario 7',
      zona: 'Gazcue',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Laura Rodríguez',
      propietario_cedula: '001-0000006-6',
      direccion: 'Av. Independencia 101',
      zona: 'Gazcue',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Miguel Torres',
      propietario_cedula: '001-0000007-7',
      direccion: 'Calle Las Damas 5',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Carmen Díaz',
      propietario_cedula: '001-0000008-8',
      direccion: 'Calle Arzobispo Meriño 18',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Roberto Núñez',
      propietario_cedula: '001-0000009-9',
      direccion: 'Calle Gustavo Mejía Ricart 22',
      zona: 'Piantini',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Isabel Vargas',
      propietario_cedula: '001-0000010-0',
      direccion: 'Av. Winston Churchill 88',
      zona: 'Piantini',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Francisco Reyes',
      propietario_cedula: '001-0000011-1',
      direccion: 'Calle Dr. Báez 14',
      zona: 'Gazcue',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Elena Castro',
      propietario_cedula: '001-0000012-2',
      direccion: 'Calle Padre Billini 9',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Andrés Morales',
      propietario_cedula: '001-0000013-3',
      direccion: 'Av. Lope de Vega 55',
      zona: 'Piantini',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Patricia Jiménez',
      propietario_cedula: '001-0000014-4',
      direccion: 'Calle Socorro Sánchez 3',
      zona: 'Gazcue',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Luis Herrera',
      propietario_cedula: '001-0000015-5',
      direccion: 'Calle Isabel la Católica 27',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Gabriela Flores',
      propietario_cedula: '001-0000016-6',
      direccion: 'Calle El Recodo 44',
      zona: 'Piantini',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Diego Ramírez',
      propietario_cedula: '001-0000017-7',
      direccion: 'Av. Sarasota 11',
      zona: 'Piantini',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Sofía Mendoza',
      propietario_cedula: '001-0000018-8',
      direccion: 'Calle Arzobispo Portes 6',
      zona: 'Zona Colonial',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
    {
      propietario_nombre: 'Ricardo Ortega',
      propietario_cedula: '001-0000019-9',
      direccion: 'Calle José Reyes 19',
      zona: 'Gazcue',
      tipo_uso: TipoUso.COMERCIAL,
      tarifa_mensual: 1500,
    },
    {
      propietario_nombre: 'Valentina Cruz',
      propietario_cedula: '001-0000020-0',
      direccion: 'Av. Máximo Gómez 77',
      zona: 'Gazcue',
      tipo_uso: TipoUso.RESIDENCIAL,
      tarifa_mensual: 300,
    },
  ];

  await repo.save(inmueblesSemilla);
  console.log('Catastro semilla insertado: 20 inmuebles.');
}
