export default function getRelativeDate(isoDateString: string): string {

    const date = new Date(isoDateString);
    const now = new Date();
    
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
  
    if (diffInSeconds < 60) {
      return 'Just now';
    }
  
    const diffInMinutes = diffInSeconds / 60;
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    }
  
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`; 
    }
  
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    }
  
    const diffInWeeks = diffInDays / 7;
    if (diffInWeeks < 5) {
      return `${Math.floor(diffInWeeks)} weeks ago`;
    }
  
    const diffInMonths = diffInDays / 30;
    if (diffInMonths < 12) {
      return `${Math.floor(diffInMonths)} months ago`;
    }
  
    const diffInYears = diffInMonths / 12;
    return `${Math.floor(diffInYears)} years ago`;
  
  }
  