import Loader from '@src/repl/components/Loader';
import { HorizontalPanel, VerticalPanel } from '@src/repl/components/panel/Panel';
import { Code } from '@src/repl/components/Code';
import UserFacingErrorMessage from '@src/repl/components/UserFacingErrorMessage';
import { Header } from './Header';
import { useSettings } from '@src/settings.mjs';
import { useGlobalContext } from '../useGlobalContext';
import { useEffect } from 'react';

// type Props = {
//  context: replcontext,
// }

export default function ReplEditor(Props) {
  const { context, ...editorProps } = Props;
  const { containerRef, editorRef, error, init, pending } = context;
  const { setReplEditorContext } = useGlobalContext();

  console.log("hello ", 'ReplEditor', editorRef.current);

  // Access the code from editorRef
  const code = editorRef.current?.code;
  console.log("Code content:", code);
  const settings = useSettings();
  const { panelPosition, isZen } = settings;

  // Register this REPL context with the global context
  useEffect(() => {
    setReplEditorContext(context);
  }, [context, setReplEditorContext]);

  return (
    <div className="h-full flex flex-col relative" {...editorProps}>
      <Loader active={pending} />
      <Header context={context} />
      <div className="grow flex relative overflow-hidden">
        <Code containerRef={containerRef} editorRef={editorRef} init={init} />
        {!isZen && panelPosition === 'right' && <VerticalPanel context={context} />}
      </div>
      <UserFacingErrorMessage error={error} />
      {!isZen && panelPosition === 'bottom' && <HorizontalPanel context={context} />}
    </div>
  );
}
