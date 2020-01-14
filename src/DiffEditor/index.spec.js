import React from 'react';
import DiffEditor from '.';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

window.MONACO_EDITOR_WEB_ROOT = "https://cdn.jsdelivr.net/npm";
describe('<DiffEditor />', () => {
  it('should check render with snapshot', () => {
    const component = render(
      <DiffEditor />,
    );

    expect(component).toMatchSnapshot();
  });
});
