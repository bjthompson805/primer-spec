import { h } from 'preact';
import Config from '../Config';
import { Subthemes, updateTheme } from '../subthemes';
import {
  usePrintInProgress,
  useBeforePrint,
  useAfterPrint,
} from '../utils/printHandlerHooks';

type PropsType = {
  currentSubthemeName: string;
  currentSubthemeMode: SubthemeModeSelectorType;
  sidebarShown: boolean;
  settingsShown: boolean;
  isSmallScreen: boolean;
  onSubthemeNameChange: (newSubthemeName: string) => void;
  onSubthemeModeChange: (newSubthemeMode: SubthemeModeSelectorType) => void;
};

export default function Settings(props: PropsType) {
  const isPrintInProgress = usePrintInProgress();

  // If a print is in progress, temporarily reset the theme to default light.
  useBeforePrint(
    () => updateTheme({ name: 'default', mode: 'light' }, false),
    [],
  );
  useAfterPrint(
    () =>
      updateTheme(
        { name: props.currentSubthemeName, mode: props.currentSubthemeMode },
        false,
      ),
    [props.currentSubthemeName, props.currentSubthemeMode],
  );

  if (!props.settingsShown || isPrintInProgress) {
    return null;
  }

  const subtheme_dropdown_options = Object.entries(Subthemes).map(([name]) => {
    return <option value={name}>{name}</option>;
  });

  return (
    <div class="primer-spec-settings-container position-fixed top-0 left-0 width-full height-full">
      <div
        class={`primer-spec-settings container-lg markdown-body px-3 my-5 ${
          props.sidebarShown && !props.isSmallScreen
            ? 'primer-spec-content-margin-extra'
            : ''
        } ${props.isSmallScreen ? 'primer-spec-content-mobile' : ''}`}
      >
        <h1 class="primer-spec-toc-ignore">{'Spec Theme Settings'}</h1>
        <label for="primer-spec-subtheme-selector">
          {'Choose your theme: '}
          <select
            name="primer-spec-subtheme-selector"
            class="primer-spec-subtheme-selector"
            onChange={(e) =>
              props.onSubthemeNameChange((e.target as HTMLSelectElement)?.value)
            }
            value={props.currentSubthemeName ?? ''}
          >
            {subtheme_dropdown_options}
          </select>
        </label>
        <br />
        <br />

        <label for="primer-spec-subtheme-mode-selector">
          {'Choose your theme mode: '}
          <select
            name="primer-spec-subtheme-mode-selector"
            class="primer-spec-subtheme-mode-selector"
            onChange={(e) =>
              props.onSubthemeModeChange(
                (e.target as HTMLSelectElement)
                  ?.value as SubthemeModeSelectorType,
              )
            }
            value={props.currentSubthemeMode ?? ''}
          >
            <option value="light">{'light'}</option>
            <option value="dark">{'dark'}</option>
            <option value="system">{'use system settings'}</option>
          </select>
        </label>

        <hr />

        <p>
          <small>
            {'Does the spec display incorrectly?'}
            <a href="https://github.com/eecs485staff/primer-spec/issues">
              {'Let us know by adding a new "issue" here.'}
            </a>
          </small>
        </p>

        <p class="primer-spec-brand">
          <a
            href="https://github.com/eecs485staff/primer-spec/"
            target="_blank"
          >
            {`Primer Spec v${Config.VERSION_RAW}`}
          </a>
        </p>
      </div>
    </div>
  );
}
