import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toPositiveAmount'
})
export class ToPositiveAmountPipe implements PipeTransform {

  transform(value: number): number {
    return Math.abs(value)
  }

}
