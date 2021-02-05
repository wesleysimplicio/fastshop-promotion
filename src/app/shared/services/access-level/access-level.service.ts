import { UserService } from 'src/app/shared/model/user/user.service';
import { Injectable } from '@angular/core';
import { User } from '../../model/user/user.model';
import { AccessLevel } from '../../enum/access-level.enum';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EnvironmentsAccess } from '../../enum/environments-access.enum';

@Injectable({providedIn: 'root'})
export class AccessLevelService {

    private user: User;

    constructor(
        private userService: UserService,
        private router: Router
        ) { }

    private environmentLocal(): boolean {
        return environment.env === EnvironmentsAccess.ENV_QA
                || environment.env === EnvironmentsAccess.ENV_DEV
                || environment.env === EnvironmentsAccess.ENV_LOCAL ;
    }

    private environmentProd(): boolean {
        return environment.env === EnvironmentsAccess.ENV_PROD;
    }

    hasAccessProd(user: User): boolean {
        const result = user.permissions.some(
            el => el === AccessLevel.GERENCIAL ||
            el === AccessLevel.OPERACIONAL) && this.environmentProd();
        return result;
    }

    hasAccessQA(user: User): boolean {
        const result = user.permissions.some(
            el => el === AccessLevel.GERENCIAL_QA || el === AccessLevel.OPERACIONAL_QA  ) && this.environmentLocal();
        return result;
    }

}
