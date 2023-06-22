/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { StickyShareButtons } from 'sharethis-reactjs';

export default function ShareButtons({ data }) {
  const { url, thumbnail, title, id } = data;

  return (
    <StickyShareButtons
      key={id}
      config={{
        alignment: 'right', // alignment of buttons (left, right)
        color: 'social', // set the color of buttons (social, white)
        enabled: true, // show/hide buttons (true, false)
        font_size: 14, // font size for the buttons
        hide_desktop: false, // hide buttons on desktop (true, false)
        labels: 'cta', // button labels (cta, counts, null)
        language: 'en', // which language to use (see LANGUAGES)
        min_count: 1, // hide react counts less than min_count (INTEGER)
        networks: [
          // which networks to include (see SHARING NETWORKS)
          'twitter',
          'reddit',
          'linkedin',
          'facebook',
          'pinterest',
          'email',
        ],
        padding: 12, // padding within buttons (INTEGER)
        radius: 4, // the corner radius on each button (INTEGER)
        show_total: true, // show/hide the total share count (true, false)
        show_mobile: true, // show/hide the buttons on mobile (true, false)
        show_toggle: true, // show/hide the toggle buttons (true, false)
        size: 48, // the size of each button (INTEGER)
        top: 160, // offset in pixels from the top of the page
        url,
        title,
        image: thumbnail.small,
      }}
    />
  );
}
