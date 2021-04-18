import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezn'
})
export class TimeznPipe implements PipeTransform {
  n(n: number) {
    return n > 9 ? '' + n : '0' + n;
  }
  transform(value: any, ...args: any[]): string {
    var h = this.n(Math.floor(value / 3600));
    var m = this.n(Math.floor((value - Number(h) * 3600) / 60));
    var s = this.n(Math.floor(value - Number(h) * 3600 - Number(m) * 60));
    return h + ':' + m + ':' + s;
  }
}
