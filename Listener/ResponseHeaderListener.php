<?php

namespace Samson\Bundle\AngularRoutingBundle\Listener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

class ResponseHeaderListener
{
    private $headers = array();

    public function addHeader($name, $value)
    {
        $this->headers[] = array($name, $value);
    }

    public function onKernelResponse(FilterResponseEvent $e) {
        $response = $e->getResponse();
        foreach($this->headers as $header) {
            $response->headers->set($header[0], $header[1], false);
        }
    }
}