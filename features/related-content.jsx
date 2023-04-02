import React from 'react';

export default function RelatedContent({ topics }) {
  return (
    <>
      <div>
        {topics.map((item) => (
          <div>{item}</div>
        ))}
      </div>
    </>
  );
}
