import React from 'react';
import Loading from '.';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

window.MONACO_EDITOR_WEB_ROOT = "https://cdn.jsdelivr.net/npm";
describe('<Loading />', () => {
  it('should check render with snapshot', () => {
    const component = render(
      <Loading />,
    );

    expect(component).toMatchSnapshot();
  });

  it('should check is it wrapped with <div />', () => {
    const component = render(
      <Loading />,
    );

    const { container } = component;

    expect(container.firstChild.tagName).toBe('DIV');
  });

  it('should check content', () => {
    const content = 'Loading...';

    const component = render(
      <Loading content={content} />,
    );

    const { container } = component;

    expect(container.textContent).toBe(content);
  });
});
