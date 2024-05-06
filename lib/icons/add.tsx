
export const AddIcon = ({ fill, size, height, width, classname }: { fill?: string, size?: number, height?: number, width?: number, classname?: string }) => (
  <svg
    width={size || width || 50}
    height={size || height || 50}
    viewBox="0 0 77 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classname}
  >
    <path d="M67.9922 38.5C67.9922 37.5614 67.6193 36.6612 66.9556 35.9975C66.2919 35.3338 65.3917 34.9609 64.4531 34.9609H42.0391V12.5469C42.0391 11.6083 41.6662 10.7081 41.0025 10.0444C40.3388 9.38068 39.4386 9.00781 38.5 9.00781C37.5614 9.00781 36.6612 9.38068 35.9975 10.0444C35.3338 10.7081 34.9609 11.6083 34.9609 12.5469V34.9609H12.5469C11.6083 34.9609 10.7081 35.3338 10.0444 35.9975C9.38068 36.6612 9.00781 37.5614 9.00781 38.5C9.00781 39.4386 9.38068 40.3388 10.0444 41.0025C10.7081 41.6662 11.6083 42.0391 12.5469 42.0391H34.9609V64.4531C34.9609 65.3917 35.3338 66.2919 35.9975 66.9556C36.6612 67.6193 37.5614 67.9922 38.5 67.9922C39.4386 67.9922 40.3388 67.6193 41.0025 66.9556C41.6662 66.2919 42.0391 65.3917 42.0391 64.4531V42.0391H64.4531C65.3917 42.0391 66.2919 41.6662 66.9556 41.0025C67.6193 40.3388 67.9922 39.4386 67.9922 38.5Z" fill="black" />
  </svg>
);