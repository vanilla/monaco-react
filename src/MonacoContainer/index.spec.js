import React from 'react';
import MonacoContainer from '.';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

window.MONACO_EDITOR_WEB_ROOT = "https://cdn.jsdelivr.net/npm";
describe('<MonacoContainer />', () => {
  it('should check render with snapshot', () => {
    const component = render(
      <MonacoContainer
      	width="100%"
      	height="100vh"
      	loading="loading..."
      	isEditorReady={false}
      />,
    );

    expect(component).toMatchSnapshot();
  });
});
