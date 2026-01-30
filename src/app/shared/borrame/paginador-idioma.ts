import { MatPaginatorIntl } from '@angular/material/paginator';

const rangoEnEspanol = (page: number, pageSize: number, length: number) => {
	if (length == 0 || pageSize == 0) {
		return `0 de ${length}`;
	}

	length = Math.max(length, 0);

	const startIndex = page * pageSize;

	const endIndex =
		startIndex < length
		? Math.min(startIndex + pageSize, length)
		: startIndex + pageSize;

	return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function paginadorIdioma() {
	const paginatorIntl = new MatPaginatorIntl();

	paginatorIntl.itemsPerPageLabel = 'Items por pág:';
	paginatorIntl.nextPageLabel = 'Siguiente';
	paginatorIntl.previousPageLabel = 'Anterior';
	paginatorIntl.getRangeLabel = rangoEnEspanol;

	return paginatorIntl;
}
