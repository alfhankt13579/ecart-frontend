import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(allProducts: any[], searchTerm: string, propName: string): any[] {
    const result: any[] = [];

    if (!allProducts || searchTerm == '' || propName == '') {
      return allProducts;
    }
    allProducts.forEach((item: any) => {
      if (
        item[propName]
          .trim()
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      ) {
        result.push(item);
      }
    });
    return result;
  }
}
