import { slug } from '../../lib/format';

export default function Badge({ children }) {
  return <span className={`pill p-${slug(children)}`}>{children}</span>;
}
