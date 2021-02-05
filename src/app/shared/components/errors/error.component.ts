import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
// import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorCode: string;
  title: string;
  message: string;
  critical: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (param: any) => {
        if (param['type']) {
          let type = param['type'];
          this.title = '';
          this.message = '';
          switch (type) {
            case 'accessdenied':
              this.errorCode = '401';
              this.critical = false;
              this.title = 'Acesso negado';
              this.message = 'Você não possui permissão neste conteúdo';
              break;
            case 'notfound':
              this.errorCode = '404';
              this.critical = false;
              this.title = 'Página não encontrada';
              this.message = 'Desculpe, não foi possível encontrar a página';
              break;
            case 'internal':
              this.errorCode = '500';
              this.critical = false;
              this.title = 'Erro interno';
              this.message = 'Desculpe, ocorreu um erro';
              break;
            default:
              this.router.navigate(['home']);
              break;
          }
        } else {
          this.router.navigate(['home']);
        }
      },
      err => {
        this.router.navigate(['home']);
      }
    );
  }
}
