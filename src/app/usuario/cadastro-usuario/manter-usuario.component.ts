import { Component } from '@angular/core';
import { Usuario } from "../../shared/model/usuario";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioService } from "../../shared/services/usuario.service";
import Swal from "sweetalert2";
import { MensagemSweetService } from "../../shared/services/mensagem-sweet.service";
import { UsuarioRestService } from 'src/app/shared/services/usuario-rest.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './manter-usuario.component.html',
  styleUrl: './manter-usuario.component.scss'
})
export class ManterUsuarioComponent {
  usuarios: Usuario[] = [];
  usuario = new Usuario('1', '', 0);
  modoEdicao = false;

  constructor(private roteador: Router, private rotaAtual: ActivatedRoute,
    private mensagemService: MensagemSweetService,
    private usuarioRestService: UsuarioRestService) {

    const idParaEdicao = this.rotaAtual.snapshot.paramMap.get('id');
    if (idParaEdicao) {
      this.modoEdicao = true;
      this.usuarioRestService.listar().subscribe(
        {
          next: usuariosRetornados => this.usuarios = usuariosRetornados
        }
      );
      this.usuarioRestService.listar().subscribe(usuarios => {
        const usuarioAEditar = usuarios.find(usuario => usuario.id == idParaEdicao);
        if (usuarioAEditar) {
          this.usuario = usuarioAEditar;
        }
      });
    }
  }


  inserir() {
    if (!this.modoEdicao) {
      try {
        this.usuarioRestService.inserir(this.usuario).subscribe((usuario: Usuario) => {
          this.usuarios.push(usuario);
        });
        this.roteador.navigate(['listagem-usuarios']);
        this.mensagemService.sucesso('Usuário cadastrado com sucesso.');
      } catch (e: any) {
        this.mensagemService.erro(e.message);
      }
    }
  }
}
