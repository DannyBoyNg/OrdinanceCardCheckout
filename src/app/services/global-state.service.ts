import { inject, Injectable, signal } from "@angular/core";
import { bufferTime, filter, map, Subject } from "rxjs";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

    db = inject(DatabaseService);

    private keyEventStream = new Subject<string>();
    public barcodeScanner$ = this.keyEventStream.pipe(
        bufferTime(200),
        filter(x => x.length === 10),
        map(x => x.join(''))
    );

    totalCards = signal(0);
    totalCardsCheckedOut = signal(0);

    onKeyEvent(key: string) {
        this.keyEventStream.next(key);
    }

    updateCardCount() {
        this.db.getCards().then(cards => {
            this.totalCards.set(cards.length);
            this.totalCardsCheckedOut.set(cards.filter(c => c.CheckedOut === 1).length);
        });
    }

}