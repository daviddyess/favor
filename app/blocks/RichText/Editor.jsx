import MantineEditor from '~/components/Tiptap/Editor';

export const RichTextBlockContentEditor = ({ content, form }) => {
  return (
    <>
      <MantineEditor name="text" form={form} />
      <input
        type="hidden"
        name="content"
        value={JSON.stringify(form.values.text)}
      />
    </>
  );
};
