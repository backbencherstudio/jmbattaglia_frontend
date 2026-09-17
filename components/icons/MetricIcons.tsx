import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function TotalPackagesMetricIcon({
  className = "",
  width = 28,
  height = 28,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M14 25.6667C13.0454 25.6667 12.1336 25.2815 10.3098 24.5111C5.76991 22.5933 3.5 21.6345 3.5 20.0215C3.5 19.5699 3.5 11.7419 3.5 8.16669M14 25.6667C14.9546 25.6667 15.8664 25.2815 17.6903 24.5111C22.2301 22.5933 24.5 21.6345 24.5 20.0215V8.16669M14 25.6667V13.2473"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.71357 11.3066L6.30551 9.65747C4.43516 8.75243 3.5 8.29992 3.5 7.58331C3.5 6.86671 4.43516 6.4142 6.30551 5.50915L9.71357 3.86004C11.8169 2.84222 12.8687 2.33331 14 2.33331C15.1313 2.33331 16.1831 2.84221 18.2865 3.86004L21.6945 5.50915C23.5648 6.4142 24.5 6.86671 24.5 7.58331C24.5 8.29992 23.5648 8.75243 21.6945 9.65747L18.2865 11.3066C16.1831 12.3244 15.1313 12.8333 14 12.8333C12.8687 12.8333 11.8169 12.3244 9.71357 11.3066Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14L9.33333 15.1667"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.8346 4.66669L8.16797 10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LivePortalMetricIcon({
  className = "",
  width = 28,
  height = 28,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M4.08203 9.3335H23.9154"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.168 14H19.8346"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.168 18.6665H17.5013"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 9.33331V24.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1667 3.5H5.83333C4.54467 3.5 3.5 4.54467 3.5 5.83333V22.1667C3.5 23.4554 4.54467 24.5 5.83333 24.5H22.1667C23.4554 24.5 24.5 23.4554 24.5 22.1667V5.83333C24.5 4.54467 23.4554 3.5 22.1667 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InDraftMetricIcon({
  className = "",
  width = 28,
  height = 28,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M12.832 25.6665C11.8775 25.6665 10.9656 25.2813 9.14178 24.5109C4.60194 22.5932 2.33203 21.6343 2.33203 20.0214C2.33203 19.5697 2.33203 11.7418 2.33203 8.1665M12.832 25.6665V13.2471M12.832 25.6665C13.2292 25.6665 13.586 25.5998 13.9987 25.4664M23.332 8.1665V13.4165"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9987 21.0007L22.0552 19.9442M25.6654 21.0002C25.6654 18.4229 23.576 16.3335 20.9987 16.3335C18.4214 16.3335 16.332 18.4229 16.332 21.0002C16.332 23.5774 18.4214 25.6668 20.9987 25.6668C23.576 25.6668 25.6654 23.5774 25.6654 21.0002Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5456 11.3068L5.13754 9.65765C3.2672 8.75261 2.33203 8.3001 2.33203 7.5835C2.33203 6.86689 3.2672 6.41438 5.13754 5.50934L8.5456 3.86022C10.649 2.84241 11.7007 2.3335 12.832 2.3335C13.9633 2.3335 15.0151 2.8424 17.1185 3.86022L20.5265 5.50934C22.3968 6.41438 23.332 6.86689 23.332 7.5835C23.332 8.3001 22.3968 8.75261 20.5265 9.65765L17.1185 11.3068C15.0151 12.3246 13.9633 12.8335 12.832 12.8335C11.7007 12.8335 10.649 12.3246 8.5456 11.3068Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83203 14L8.16536 15.1667"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6667 4.66669L7 10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddonServicesMetricIcon({
  className = "",
  width = 28,
  height = 28,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M12.832 25.6665C11.8775 25.6665 10.9656 25.2813 9.14178 24.5109C4.60194 22.5932 2.33203 21.6343 2.33203 20.0214C2.33203 19.5697 2.33203 11.7418 2.33203 8.1665M12.832 25.6665V13.2471M12.832 25.6665C13.6776 25.6665 14.3405 25.3642 15.7487 24.7595M23.332 8.1665V12.8332"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 20.4166H25.6667M21.5833 24.5V16.3333"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5456 11.3068L5.13754 9.65765C3.2672 8.75261 2.33203 8.3001 2.33203 7.5835C2.33203 6.86689 3.2672 6.41438 5.13754 5.50934L8.5456 3.86022C10.649 2.84241 11.7007 2.3335 12.832 2.3335C13.9633 2.3335 15.0151 2.8424 17.1185 3.86022L20.5265 5.50934C23.3968 6.41438 23.332 6.86689 23.332 7.5835C23.332 8.3001 22.3968 8.75261 20.5265 9.65765L17.1185 11.3068C15.0151 12.3246 13.9633 12.8335 12.832 12.8335C11.7007 12.8335 10.649 12.3246 8.5456 11.3068Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83203 14L8.16536 15.1667"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6667 4.66669L7 10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
