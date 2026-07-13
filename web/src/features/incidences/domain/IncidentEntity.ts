export interface IncidentEntity {
  id: string;
  lat: number;
  lng: number;
  type: 'obra' | 'mantenimiento';
  title: string;
}

export interface IncidentCategoryEntity {
  id: string;
  name: string;
  type: 'obra' | 'mantenimiento';
}
