import { Injectable } from "@angular/core";
import { bufferTime, filter, map, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

    private keyEventStream = new Subject<string>();
    public barcodeScanner$ = this.keyEventStream.pipe(
        bufferTime(200),
        filter(x => x.length === 10),
        map(x => x.join(''))
    );

    onKeyEvent(key: string) {
        this.keyEventStream.next(key);
    }

}