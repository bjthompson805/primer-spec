import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import IconType from '../common/IconType';
import InlineButton from '../common/InlineButton';
import TableOfContents from './TableOfContents';
import { usePrintInProgress } from '../../utils/hooks';

type SidebarProps = {
  contentNodeSelector: string;

  isSmallScreen: boolean;
  sidebarShown: boolean;
  settingsShown: boolean;
  activeSectionOffsetY: number;
  onToggleSidebar: () => void;
  onToggleSettings: () => void;
};

export default function Sidebar(props: SidebarProps) {
  useEffect(() => {
    // On small screens, close the Sidebar if the user clicks outside the
    // Sidebar. We have to check the following before toggling the Sidebar:
    //   - The clicked element is not in the sidebar
    //   - The clicked element is still present in the DOM
    //       (If the user clicks the Sidebar toggle, the toggle disappears with
    //       the Sidebar, but the click handler fires only afterwards. The
    //       toggle is _technically_ not in the sidebar any more.)
    //   - The Sidebar is shown.
    const window_click_listener = (event: Event) => {
      const target = event?.target as HTMLElement | null;
      if (
        target &&
        !target.matches('.primer-spec-sidebar, .primer-spec-sidebar *') &&
        document.body.contains(target) &&
        props.sidebarShown
      ) {
        props.onToggleSidebar();
      }
    };

    if (props.isSmallScreen) {
      window.addEventListener('click', window_click_listener);
    }
    return () => {
      window.removeEventListener('click', window_click_listener);
    };
  }, [props.isSmallScreen, props.sidebarShown]);

  const is_print_in_progress = usePrintInProgress();

  if (!props.sidebarShown || is_print_in_progress) {
    return <div />;
  }

  // The explicit onClick handler is needed to force Safari (iOS) to propagate
  // click events for the sidebar.
  // We use an <aside> element to indicate to screen-readers that the Sidebar
  // only contains complementary content.
  // We also need to unset the Sidebar's `tabIndex` to make its border
  // unfocusable.
  return (
    <aside
      class="primer-spec-sidebar position-fixed top-0 py-5 no-print"
      onClick={() => true}
      aria-label="Table of Contents"
      tabIndex={-1}
    >
      <h2 class="primer-spec-toc-ignore" id="primer-spec-toc-contents">
        Contents
        <InlineButton
          icon={IconType.SIDEBAR}
          onClick={props.onToggleSidebar}
          ariaLabel="Close navigation pane"
        />
      </h2>
      <br />
      <TableOfContents
        contentNodeSelector={props.contentNodeSelector}
        isSmallScreen={props.isSmallScreen}
        sidebarShown={props.sidebarShown}
        settingsShown={props.settingsShown}
        activeSectionOffsetY={props.activeSectionOffsetY}
        onToggleSidebar={props.onToggleSidebar}
        onToggleSettings={props.onToggleSettings}
      />
    </aside>
  );
}
