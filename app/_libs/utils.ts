import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// 表示用のフォーマット（スラッシュ区切り）
export const formatDate = (date: string) => {
	return dayjs.utc(date).tz('Asia/Tokyo').format('YYYY/MM/DD');
};

// datetime属性用のフォーマット（ISO 8601準拠、ハイフン区切り）
export const formatDateISO = (date: string) => {
	return dayjs.utc(date).tz('Asia/Tokyo').format('YYYY-MM-DD');
};
