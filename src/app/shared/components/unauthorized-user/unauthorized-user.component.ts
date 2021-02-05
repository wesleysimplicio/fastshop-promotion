import { Component } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-unauthorized-user',
  templateUrl: './unauthorized-user.component.html',
  styleUrls: ['./unauthorized-user.component.scss']
})
export class UnauthorizedUserComponent {
  redirectToLogin(): void {
    window.location.href = environment.login;
  }

}
