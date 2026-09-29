import Image from 'next/image';

const topScallops = Array.from({ length: 19 }, (_, index) => `A 10 10 0 0 1 ${40 + index * 20} 0`).join(' ');
const rightScallops = Array.from({ length: 13 }, (_, index) => `A 10 10 0 0 0 400 ${40 + index * 20}`).join(' ');
const bottomScallops = Array.from({ length: 19 }, (_, index) => `A 10 10 0 0 0 ${360 - index * 20} 300`).join(' ');
const leftScallops = Array.from({ length: 13 }, (_, index) => `A 10 10 0 0 0 0 ${260 - index * 20}`).join(' ');

const SCALLOP_PATH = [
  'M 0 20',
  'Q 0 0 20 0',
  topScallops,
  'Q 400 0 400 20',
  rightScallops,
  'Q 400 300 380 300',
  bottomScallops,
  'Q 0 300 0 280',
  leftScallops,
  'Q 0 0 0 20 Z',
].join(' ');

const MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="none"><path fill="white" d="${SCALLOP_PATH}"/></svg>`)}")`;

export default function WavyImageFrame({ src, alt, className = '', priority = false }) {
  return (
    <div className={`wavy-image-frame ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="wavy-image-frame__image"
        style={{ '--wavy-mask-image': MASK_URL }}
      />
      <svg className="wavy-image-frame__outline" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
        <path d={SCALLOP_PATH} />
      </svg>
    </div>
  );
}
