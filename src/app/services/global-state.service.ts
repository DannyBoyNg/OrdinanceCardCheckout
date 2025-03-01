import { computed, inject, Injectable, signal } from "@angular/core";
import { bufferTime, filter, map, Subject } from "rxjs";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

    db = inject(DatabaseService);

    private keyEventStream = new Subject<string>();
    public barcodeScanner$ = this.keyEventStream.pipe(
        bufferTime(500),
        filter(x => x.length === 10),
        map(x => x.join(''))
    );

    totalCards = signal(0);
    cardsCheckedOut = signal(0);
    cardsAvailable = computed(() => this.totalCards() - this.cardsCheckedOut())

    onKeyEvent(key: string) {
        this.keyEventStream.next(key);
    }

    updateCardCount() {
        this.db.getCards().then(cards => {
            this.totalCards.set(cards.length);
            this.cardsCheckedOut.set(cards.filter(c => c.CheckedOut === 1).length);
        });
    }

}