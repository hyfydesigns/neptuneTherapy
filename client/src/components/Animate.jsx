import useInView from '../hooks/useInView';

/**
 * Wraps children in a div that animates when it enters the viewport.
 *
 * type: 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in'
 * stagger: if true, applies stagger delay classes to direct children
 * delay: extra CSS transition-delay in ms
 */
export default function Animate({
  children,
  type = 'fade-up',
  stagger = false,
  delay = 0,
  className = '',
  as: Tag = 'div',
}) {
  const [ref, inView] = useInView();

  const base = `anim-${type}`;
  const staggerCls = stagger ? 'anim-stagger' : '';
  const viewCls = inView ? 'in-view' : '';

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`${base} ${staggerCls} ${viewCls} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
