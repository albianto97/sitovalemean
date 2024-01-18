import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../models/order';

@Pipe({
  name: 'statusIconHtml'
})
export class StatusIconHtmlPipe implements PipeTransform {

  transform(status: any): string {
    switch (status) {
      case Status.inAttesa:
        return '<div class="badge bg-wait">Stato: In Attesa</div>';
      case Status.rifiutato:
        return '<div class="badge bg-reject">Stato: Rifiutato</div>';
      case Status.accettato:
        return '<div class="badge bg-accept">Stato: Accettato</div>';
      case Status.lavorazione:
        return '<div class="badge bg-working">Stato: Lavorazione</div>';
      case Status.terminato:
        return '<div class="badge bg-terminated">Stato: Terminato</div>';
      case Status.consegnato:
        return '<div class="badge bg-shipped">Stato: Consegnato</div>';
      default:
        return '';
    }
  }

}
