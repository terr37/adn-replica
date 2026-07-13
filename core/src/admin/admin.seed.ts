import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioAdmin, RolUsuario } from './entities/usuario.entity';

export async function seedUsuariosAdmin(dataSource: DataSource) {
  const repo = dataSource.getRepository(UsuarioAdmin);
  const count = await repo.count();
  if (count > 0) return;

  const usuarios = [
    {
      username: 'admin',
      password_hash: await bcrypt.hash('admin123', 10),
      rol: RolUsuario.EDITOR,
    },
    {
      username: 'visor',
      password_hash: await bcrypt.hash('visor123', 10),
      rol: RolUsuario.SOLO_LECTURA,
    },
  ];

  await repo.save(usuarios);
  console.log('Usuarios admin creados: admin (EDITOR) y visor (SOLO_LECTURA)');
}
