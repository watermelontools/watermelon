def check_email_selector(input)
  if input.include?('input[type="email"]')
    return "Email input detected"
  else
    return "No email input found"
  end
end

