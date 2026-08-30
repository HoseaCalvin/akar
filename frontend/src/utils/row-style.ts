export type Level = 'Critical' | 'High' | 'Medium' | 'Low';

export function getBorderColor(level: Level) {
  switch (level) {
    case 'Critical':
      return 'border-warning-critical';
    case 'High':
      return 'border-warning-high';
    case 'Medium':
      return 'border-warning-medium';
    case 'Low':
      return 'border-warning-low';
    default:
      return '';
  }
}

export function getRowBackgroundColor(level: Level) {
  switch (level) {
    case 'Critical':
      return 'bg-red-50 border-red-100';
    case 'High':
      return 'bg-amber-50 border-amber-100';
    case 'Low':
      return 'bg-white border-gray-100';
    default:
      return 'bg-white border-gray-100';
  }
};

export function getDescriptionColor(level: Level) {
  switch (level) {
    case 'Critical':
      return 'text-red-500';
    case 'High':
      return 'text-yellow-400';
    case 'Low':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }  
}

export function getBadgeColor(level: Level) {
  switch (level) {
    case 'Critical':
      return 'bg-red-100';
    case 'High':
      return 'bg-amber-100';
    case 'Low':
      return 'bg-green-50';
    default:
      return 'bg-white border-gray-100';
  }  
}

export function getBadgeTextColor(status: Level) {
  switch (status) {
    case 'Critical':
      return 'text-warning-critical';
    case 'High':
      return 'text-warning-high';
    case 'Low':
      return 'text-warning-low';
    default:
      return 'text-gray-400';
  }    
}