import { AuthService } from './../services/auth.service';
import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({ selector: '[appShowIfAuthed]' })
export class ShowAuthedDirective implements OnInit {
  condition: boolean;

  constructor(
    private userService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    this.userService.currentUser()
    .subscribe(
      (isAuthenticated) => {
        if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

  @Input() set appShowIfAuthed(condition: boolean) {
    this.condition = condition;
  }
}
