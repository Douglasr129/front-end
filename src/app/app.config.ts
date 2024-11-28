import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AccountGuard } from './account/services/account.guard';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ErrorInterceptor } from './services/error.handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      enableHtml: true,
      tapToDismiss: true,
      closeButton:true,
      newestOnTop:true,
      progressBar:true,
      progressAnimation: 'decreasing',
      maxOpened: 4
     }),
     AccountGuard,
     provideEnvironmentNgxMask(),
     importProvidersFrom(NgxSpinnerModule.forRoot(/*config*/)),
     provideAnimations(),
     {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ]
};
