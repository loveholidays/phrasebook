import { render } from '@testing-library/react';
import * as Stories from './TranslationComponent.stories';

const { default: ignore, ...stories } = Stories;

describe('Translation component', () => {
  it.each(
    Object.entries(stories),
  )('%s', (storyName, storyFn) => {
    const { asFragment } = render(storyFn());

    expect(asFragment()).toMatchSnapshot();
  });
});
